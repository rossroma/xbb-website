import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { RequestUser } from '../strategies/jwt.strategy';

/**
 * API 权限守卫
 * 与 @RequirePermissions() 装饰器配合使用，校验用户是否拥有接口所需的权限
 *
 * 校验逻辑：
 * 1. 无 @RequirePermissions 标记的接口 → 直接放行
 * 2. @Public() 标记的接口 → 直接放行（无需认证）
 * 3. 超级管理员（type === 1）→ 直接放行
 * 4. 普通管理员 → 检查 group_info.rules 是否包含任一所需 action_code
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 公开接口放行
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 获取接口所需的权限列表
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 无权限标记的接口直接放行（渐进式启用，后续按需添加装饰器）
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser | undefined;

    if (!user) {
      throw new ForbiddenException('无权限访问');
    }

    // 超级管理员放行
    if (user.type === 1) return true;

    // 解析用户拥有的权限
    const userRules = (user.group_info?.rules || '')
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    // 检查是否拥有任一所需权限（OR 逻辑）
    const hasPermission = requiredPermissions.some((code) => userRules.includes(code));

    if (!hasPermission) {
      throw new ForbiddenException('无权限访问');
    }

    return true;
  }
}