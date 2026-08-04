import { SetMetadata } from '@nestjs/common';

/** 权限守卫元数据键 */
export const PERMISSIONS_KEY = 'requirePermissions';

/**
 * 标记接口所需的权限（action_code 列表）
 * 与 PermissionsGuard 配合使用，用于 API 级别的权限校验
 *
 * @example
 * // 在 Controller 上标记，整个 Controller 需要这些权限
 * @RequirePermissions('setting', '61')
 * @Controller('admin/settings')
 * export class AdminSettingsController {}
 *
 * @example
 * // 在单个 Handler 上标记
 * @RequirePermissions('admin_groups', '63')
 * @Get('admin-groups')
 * async findAll() {}
 */
export const RequirePermissions = (...actionCodes: string[]) =>
  SetMetadata(PERMISSIONS_KEY, actionCodes);