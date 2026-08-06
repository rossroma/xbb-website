import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from './entities/admin.entity';
import { AdminGroup } from './entities/admin-group.entity';
import { AdminAction } from './entities/admin-action.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminGroupDto } from './dto/create-admin-group.dto';
import { UpdateAdminGroupDto } from './dto/update-admin-group.dto';
import { QueryAdminDto } from './dto/query-admin.dto';
import { AdminResponseDto, AdminGroupResponseDto, AdminActionResponseDto } from './dto/admin-response.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminGroup)
    private adminGroupRepository: Repository<AdminGroup>,
    @InjectRepository(AdminAction)
    private adminActionRepository: Repository<AdminAction>,
  ) { }

  // ==================== 管理员管理 ====================

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    // 检查用户名是否已存在
    const existingAdmin = await this.adminRepository.findOne({
      where: { username: createAdminDto.username },
    });

    if (existingAdmin) {
      throw new NotFoundException('用户名已存在');
    }

    // 生成盐值和加密密码
    const { hash, salt } = await this.hashPassword(createAdminDto.password);

    const admin = this.adminRepository.create({
      ...createAdminDto,
      userpwd: hash,
      salt,
      status: createAdminDto.status ?? 1,
    });

    const saved = await this.adminRepository.save(admin);
    return this.formatAdminResponse(saved);
  }

  async findAllAdmins(query: QueryAdminDto): Promise<{
    items: AdminResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, username, status, type, sortBy = 'id_desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (username) where.username = Like(`%${username}%`);
    if (status !== undefined) where.status = status;
    if (type !== undefined) where.type = type;

    const orderMap: Record<string, object> = {
      id_desc: { id: 'DESC' },
      id_asc: { id: 'ASC' },
      addtime_desc: { id: 'DESC' },
      addtime_asc: { id: 'ASC' },
    };
    const order = orderMap[sortBy] ?? { id: 'DESC' };

    const [items, total] = await this.adminRepository.findAndCount({
      where,
      order,
      skip,
      take: limit,
      relations: ['adminGroup'],
    });

    return {
      items: items.map((item) => this.formatAdminResponse(item)),
      total,
      page,
      limit,
    };
  }

  async findOneAdmin(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['adminGroup'],
    });

    if (!admin) {
      throw new NotFoundException(`管理员 #${id} 不存在`);
    }

    return this.formatAdminResponse(admin);
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`管理员 #${id} 不存在`);
    }

    // 如果更新密码，重新加密
    if (updateAdminDto.password) {
      const { hash, salt } = await this.hashPassword(updateAdminDto.password);
      updateAdminDto.password = hash;
      (updateAdminDto as any).salt = salt;
    }

    Object.assign(admin, updateAdminDto);
    const updated = await this.adminRepository.save(admin);
    return this.formatAdminResponse(updated);
  }

  async removeAdmin(id: number): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`管理员 #${id} 不存在`);
    }

    // 不能删除超级管理员
    if (admin.type === 1) {
      throw new NotFoundException('不能删除超级管理员');
    }

    await this.adminRepository.remove(admin);
  }

  // ==================== 用户组管理 ====================

  async createAdminGroup(createAdminGroupDto: CreateAdminGroupDto): Promise<AdminGroupResponseDto> {
    const adminGroup = this.adminGroupRepository.create(createAdminGroupDto);
    const saved = await this.adminGroupRepository.save(adminGroup);
    return this.formatAdminGroupResponse(saved);
  }

  async findAllAdminGroups(page = 1, limit = 10, sortBy = 'id_asc'): Promise<{ items: AdminGroupResponseDto[]; total: number; page: number; limit: number }> {
    const orderMap: Record<string, object> = {
      id_desc: { id: 'DESC' },
      id_asc: { id: 'ASC' },
    };
    const order = orderMap[sortBy] ?? { id: 'ASC' };
    const skip = (page - 1) * limit;
    const [groups, total] = await this.adminGroupRepository.findAndCount({
      order,
      skip,
      take: limit,
    });
    return { items: groups.map((item) => this.formatAdminGroupResponse(item)), total, page, limit };
  }

  async findOneAdminGroup(id: number): Promise<AdminGroupResponseDto> {
    const adminGroup = await this.adminGroupRepository.findOne({ where: { id } });
    if (!adminGroup) {
      throw new NotFoundException(`用户组 #${id} 不存在`);
    }
    return this.formatAdminGroupResponse(adminGroup);
  }

  async updateAdminGroup(id: number, updateAdminGroupDto: UpdateAdminGroupDto): Promise<AdminGroupResponseDto> {
    const adminGroup = await this.adminGroupRepository.findOne({ where: { id } });
    if (!adminGroup) {
      throw new NotFoundException(`用户组 #${id} 不存在`);
    }

    Object.assign(adminGroup, updateAdminGroupDto);
    const updated = await this.adminGroupRepository.save(adminGroup);
    return this.formatAdminGroupResponse(updated);
  }

  async removeAdminGroup(id: number): Promise<void> {
    const adminGroup = await this.adminGroupRepository.findOne({ where: { id } });
    if (!adminGroup) {
      throw new NotFoundException(`用户组 #${id} 不存在`);
    }

    // 检查是否有管理员使用此用户组
    const adminCount = await this.adminRepository.count({ where: { group_id: id } });
    if (adminCount > 0) {
      throw new NotFoundException('该用户组下还有管理员，不能删除');
    }

    await this.adminGroupRepository.remove(adminGroup);
  }

  // ==================== 权限管理 ====================

  async findAllAdminActions(): Promise<AdminActionResponseDto[]> {
    const actions = await this.adminActionRepository.find({
      where: { status: 1 },
      order: { ord: 'ASC', id: 'ASC' },
    });

    const existingIds = new Set(actions.map(a => a.id));
    const missingParentIds = [...new Set(actions.map(a => a.parent_id))]
      .filter(pid => pid !== 0 && !existingIds.has(pid));

    if (missingParentIds.length > 0) {
      const parents = await this.adminActionRepository.findByIds(missingParentIds);
      actions.push(...parents);
      actions.sort((a, b) => a.ord - b.ord || a.id - b.id);
    }

    return this.buildActionTree(actions);
  }

  async findAdminPermissions(adminId: number): Promise<AdminActionResponseDto[]> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ['adminGroup'],
    });

    if (!admin) {
      throw new NotFoundException(`管理员 #${adminId} 不存在`);
    }

    // 超级管理员拥有所有权限
    if (admin.type === 1) {
      return this.findAllAdminActions();
    }

    // 根据用户组权限获取（rules 存储的是 action_code 字符串，不是整数 ID）
    if (admin.adminGroup && admin.adminGroup.rules) {
      const actionCodes = admin.adminGroup.rules.split(',').map(code => code.trim()).filter(Boolean);
      if (actionCodes.length > 0) {
        const actions = await this.adminActionRepository
          .createQueryBuilder('action')
          .where('action.action_code IN (:...codes)', { codes: actionCodes })
          .andWhere('action.status = :status', { status: 1 })
          .orderBy('action.ord', 'ASC')
          .addOrderBy('action.id', 'ASC')
          .getMany();

        // 补全父级节点，保持树结构完整
        const existingIds = new Set(actions.map(a => a.id));
        const missingParentIds = [...new Set(actions.map(a => a.parent_id))]
          .filter(pid => pid !== 0 && !existingIds.has(pid));
        if (missingParentIds.length > 0) {
          const parents = await this.adminActionRepository.findByIds(missingParentIds);
          actions.push(...parents);
          actions.sort((a, b) => a.ord - b.ord || a.id - b.id);
        }

        return this.buildActionTree(actions);
      }
    }

    return [];
  }

  // ==================== 辅助方法 ====================

  private async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const hash = await bcrypt.hash(password, 10);
    return { hash, salt: '' };
  }

  private formatAdminResponse(admin: Admin): AdminResponseDto {
    return {
      id: admin.id,
      username: admin.username,
      status: admin.status,
      type: admin.type,
      group_id: admin.group_id,
      group_name: admin.adminGroup?.title || undefined,
    };
  }

  private formatAdminGroupResponse(adminGroup: AdminGroup): AdminGroupResponseDto {
    return {
      id: adminGroup.id,
      title: adminGroup.title,
      rules: adminGroup.rules,
      rules_category: adminGroup.rules_category,
      status: adminGroup.status,
    };
  }

  private formatAdminActionResponse(action: AdminAction): AdminActionResponseDto {
    return {
      id: action.id,
      parent_id: action.parent_id,
      action_code: action.action_code,
      action_name: action.action_name,
      ord: action.ord,
      url: action.url,
      status: action.status,
      children: [],
    };
  }

  private buildActionTree(actions: AdminAction[]): AdminActionResponseDto[] {
    // parent_id 直接引用本表 id，parent_id === 0 为根节点
    const nodeMap = new Map<number, AdminActionResponseDto>();
    const rootActions: AdminActionResponseDto[] = [];

    // 第一遍：创建所有节点
    actions.forEach(action => {
      nodeMap.set(action.id, this.formatAdminActionResponse(action));
    });

    // 第二遍：构建树结构
    actions.forEach(action => {
      const node = nodeMap.get(action.id)!;
      if (action.parent_id === 0 || !nodeMap.has(action.parent_id)) {
        rootActions.push(node);
      } else {
        const parent = nodeMap.get(action.parent_id)!;
        parent.children.push(node);
      }
    });

    return rootActions;
  }
}