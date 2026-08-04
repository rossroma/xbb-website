import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from '../admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { CreateAdminGroupDto } from '../dto/create-admin-group.dto';
import { UpdateAdminGroupDto } from '../dto/update-admin-group.dto';
import { QueryAdminDto } from '../dto/query-admin.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
export class AdminAdminController {
  constructor(private readonly adminService: AdminService) { }

  // ==================== 管理员管理 ====================

  @Post('admins')
  @RequirePermissions('user', '54')
  @OperationLog({ title: '管理员', type: 1, targetFields: ['username'], titlePrefix: '管理员：' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<any> {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Get('admins')
  @RequirePermissions('user', '54')
  async findAllAdmins(@Query() query: QueryAdminDto): Promise<any> {
    return await this.adminService.findAllAdmins(query);
  }

  @Get('admins/:id')
  @RequirePermissions('user', '54')
  async findOneAdmin(@Param('id') id: string): Promise<any> {
    return await this.adminService.findOneAdmin(+id);
  }

  @Patch('admins/:id')
  @RequirePermissions('user', '54')
  @OperationLog({ title: '管理员', type: 2, targetFields: ['username'], titlePrefix: '管理员：' })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<any> {
    return await this.adminService.updateAdmin(+id, updateAdminDto);
  }

  @Delete('admins/:id')
  @RequirePermissions('user', '54')
  @OperationLog({ title: '管理员', type: 3, targetFields: ['username'] })
  async removeAdmin(@Param('id') id: string): Promise<any> {
    const target = await this.adminService.findOneAdmin(+id);
    await this.adminService.removeAdmin(+id);
    return target;
  }

  // ==================== 用户组管理 ====================

  @Post('admin-groups')
  @RequirePermissions('admin_groups', '63')
  @OperationLog({ title: '用户组', type: 1, targetFields: ['title'], titlePrefix: '用户组：' })
  async createAdminGroup(@Body() createAdminGroupDto: CreateAdminGroupDto): Promise<any> {
    return await this.adminService.createAdminGroup(createAdminGroupDto);
  }

  @Get('admin-groups')
  @RequirePermissions('admin_groups', '63')
  async findAllAdminGroups(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
  ): Promise<any> {
    return await this.adminService.findAllAdminGroups(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      sortBy || 'id_asc',
    );
  }

  @Get('admin-groups/:id')
  @RequirePermissions('admin_groups', '63')
  async findOneAdminGroup(@Param('id') id: string): Promise<any> {
    return await this.adminService.findOneAdminGroup(+id);
  }

  @Patch('admin-groups/:id')
  @RequirePermissions('admin_groups', '63')
  @OperationLog({ title: '用户组权限设置', type: 2, targetFields: ['title'], titlePrefix: '用户组权限：' })
  async updateAdminGroup(
    @Param('id') id: string,
    @Body() updateAdminGroupDto: UpdateAdminGroupDto,
  ): Promise<any> {
    return await this.adminService.updateAdminGroup(+id, updateAdminGroupDto);
  }

  @Delete('admin-groups/:id')
  @RequirePermissions('admin_groups', '63')
  @OperationLog({ title: '用户组', type: 3, targetFields: ['title'], titlePrefix: '用户组：' })
  async removeAdminGroup(@Param('id') id: string): Promise<any> {
    const target = await this.adminService.findOneAdminGroup(+id);
    await this.adminService.removeAdminGroup(+id);
    return target;
  }

  // ==================== 权限管理 ====================

  @Get('admin-actions')
  async findAllAdminActions(): Promise<any> {
    return await this.adminService.findAllAdminActions();
  }

  @Get('admin-permissions/:adminId')
  async findAdminPermissions(@Param('adminId') adminId: string): Promise<any> {
    return await this.adminService.findAdminPermissions(+adminId);
  }
}
