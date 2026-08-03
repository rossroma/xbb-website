import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationLog } from './entities/operation-log.entity';
import { LoginLog } from './entities/login-log.entity';

export interface OperationLogData {
  /** 操作人 ID */
  admin_id?: number;
  /** 操作人名称 */
  admin_name?: string;
  /** 操作模块 */
  module?: string;
  /** 操作类型：1-新增，2-修改，3-删除 */
  type?: number;
  /** 操作标题 */
  title?: string;
  /** 操作内容描述 */
  content?: string;
  /** 目标资源 ID */
  target_id?: number;
  /** 请求 IP */
  ip?: string;
  /** 请求方法 */
  method?: string;
  /** 请求 URL */
  url?: string;
  /** 请求参数 */
  params?: Record<string, any>;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(OperationLog)
    private operationLogRepo: Repository<OperationLog>,
    @InjectRepository(LoginLog)
    private loginLogRepo: Repository<LoginLog>,
  ) {}

  /**
   * 记录操作日志
   */
  async logOperation(data: OperationLogData): Promise<void> {
    const operationLog = this.operationLogRepo.create({
      username: data.admin_name || '',
      title: data.content || `${data.title || ''}`,
      type: data.type || 0,
      login_ip: data.ip || '',
      addtime: Math.floor(Date.now() / 1000),
    });
    await this.operationLogRepo.save(operationLog);
  }

  /**
   * 记录登录日志
   */
  async recordLogin(username: string, ip: string, status: number, userAgent?: string): Promise<void> {
    const loginLog = this.loginLogRepo.create({
      username,
      login_ip: ip || '',
      type: 1, // 管理员登录
      user_agent: userAgent || '',
      addtime: Math.floor(Date.now() / 1000),
    });
    await this.loginLogRepo.save(loginLog);
  }

  /**
   * 记录登录日志（扩展版）
   */
  async logLogin(data: {
    admin_id?: number;
    admin_name?: string;
    status: 'success' | 'failed';
    ip?: string;
    user_agent?: string;
    reason?: string;
  }): Promise<void> {
    const loginLog = this.loginLogRepo.create({
      username: data.admin_name || '',
      login_ip: data.ip || '',
      type: data.status === 'success' ? 1 : 0,
      user_agent: data.user_agent || '',
      addtime: Math.floor(Date.now() / 1000),
    });
    await this.loginLogRepo.save(loginLog);
  }

  /**
   * 查询操作日志列表
   */
  async getOperationLogs(params: {
    page?: number;
    limit?: number;
    keyword?: string;
    action_type?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.operationLogRepo.createQueryBuilder('log');

    // 关键词搜索（标题或用户名）
    if (params.keyword && params.keyword.trim()) {
      qb.andWhere(
        '(log.title LIKE :keyword OR log.username LIKE :keyword)',
        { keyword: `%${params.keyword.trim()}%` },
      );
    }

    // 操作类型筛选
    if (params.action_type) {
      const typeMap: Record<string, number> = { create: 1, update: 2, delete: 3 };
      const typeValue = typeMap[params.action_type];
      if (typeValue !== undefined) {
        qb.andWhere('log.type = :type', { type: typeValue });
      }
    }

    // 日期范围筛选
    if (params.start_date) {
      qb.andWhere('log.addtime >= :startTime', {
        startTime: Math.floor(new Date(params.start_date).getTime() / 1000),
      });
    }
    if (params.end_date) {
      qb.andWhere('log.addtime <= :endTime', {
        endTime: Math.floor(new Date(params.end_date).getTime() / 1000) + 86400,
      });
    }

    qb.orderBy('log.id', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    // 格式化返回数据
    const formattedItems = items.map((item) => ({
      id: item.id,
      operator: item.username,
      action: this.getActionTypeKey(item.type),
      action_text: this.getActionTypeText(item.type),
      module: item.title?.split('：')[0] || item.title || '',
      content: item.title || '',
      ip: item.login_ip || '',
      addtime: item.addtime,
      formatted_time: item.addtime
        ? new Date(item.addtime * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
        : '',
    }));

    return { items: formattedItems, total };
  }

  /**
   * 查询登录日志列表
   */
  async getLoginLogs(params: {
    page?: number;
    limit?: number;
    username?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.loginLogRepo.createQueryBuilder('log');

    // 用户名搜索
    if (params.username && params.username.trim()) {
      qb.andWhere('log.username LIKE :username', {
        username: `%${params.username.trim()}%`,
      });
    }

    // 登录状态筛选（type: 1=成功, 0=失败）
    if (params.status) {
      const typeValue = params.status === 'success' ? 1 : 0;
      qb.andWhere('log.type = :type', { type: typeValue });
    }

    // 日期范围筛选
    if (params.start_date) {
      qb.andWhere('log.addtime >= :startTime', {
        startTime: Math.floor(new Date(params.start_date).getTime() / 1000),
      });
    }
    if (params.end_date) {
      qb.andWhere('log.addtime <= :endTime', {
        endTime: Math.floor(new Date(params.end_date).getTime() / 1000) + 86400,
      });
    }

    qb.orderBy('log.id', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    // 格式化返回数据
    const formattedItems = items.map((item) => ({
      id: item.id,
      username: item.username,
      status: item.type === 1 ? 'success' : 'failed',
      status_text: item.type === 1 ? '成功' : '失败',
      ip: item.login_ip || '',
      user_agent: item.user_agent || '',
      addtime: item.addtime,
      formatted_time: item.addtime
        ? new Date(item.addtime * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
        : '',
    }));

    return { items: formattedItems, total };
  }

  /**
   * 获取日志统计
   */
  async getLogsStats(params: {
    start_date?: string;
    end_date?: string;
  }) {
    const startTime = params.start_date
      ? Math.floor(new Date(params.start_date).getTime() / 1000)
      : 0;
    const endTime = params.end_date
      ? Math.floor(new Date(params.end_date).getTime() / 1000) + 86400
      : Math.floor(Date.now() / 1000);

    const todayStart = Math.floor(
      new Date(new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })).getTime() / 1000,
    );

    const [totalOperations, totalLogins, failedLogins, activeUsers, todayOperations] =
      await Promise.all([
        // 总操作数
        this.operationLogRepo
          .createQueryBuilder('log')
          .where('log.addtime >= :startTime AND log.addtime <= :endTime', {
            startTime: startTime || undefined,
            endTime,
          })
          .getCount()
          .catch(() => 0),

        // 总登录次数
        this.loginLogRepo
          .createQueryBuilder('log')
          .where('log.addtime >= :startTime AND log.addtime <= :endTime', {
            startTime: startTime || undefined,
            endTime,
          })
          .getCount()
          .catch(() => 0),

        // 登录失败次数
        this.loginLogRepo
          .createQueryBuilder('log')
          .where('log.addtime >= :startTime AND log.addtime <= :endTime', {
            startTime: startTime || undefined,
            endTime,
          })
          .andWhere('log.type = :type', { type: 0 })
          .getCount()
          .catch(() => 0),

        // 活跃用户数（去重）
        this.operationLogRepo
          .createQueryBuilder('log')
          .select('DISTINCT log.username')
          .where('log.addtime >= :startTime AND log.addtime <= :endTime', {
            startTime: startTime || undefined,
            endTime,
          })
          .getCount()
          .catch(() => 0),

        // 今日操作数
        this.operationLogRepo
          .createQueryBuilder('log')
          .where('log.addtime >= :todayStart', { todayStart })
          .getCount()
          .catch(() => 0),
      ]);

    return {
      total_operations: totalOperations,
      total_logins: totalLogins,
      failed_logins: failedLogins,
      active_users: activeUsers,
      today_operations: todayOperations,
    };
  }

  /** 操作类型数字 → 英文 key */
  private getActionTypeKey(type: number): string {
    const map: Record<number, string> = { 1: 'create', 2: 'update', 3: 'delete' };
    return map[type] || 'unknown';
  }

  /** 操作类型数字 → 中文文本 */
  private getActionTypeText(type: number): string {
    const map: Record<number, string> = { 1: '新增', 2: '修改', 3: '删除' };
    return map[type] || '未知';
  }
}