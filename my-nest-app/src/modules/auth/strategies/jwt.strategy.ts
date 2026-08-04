import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../entities/admin.entity';

export interface JwtPayload {
  sub: number;
  username: string;
  type: number;
  group_id: number;
}

export interface RequestUser {
  id: number;
  username: string;
  type: number;
  group_id: number;
  group_info?: {
    rules: string;
    rules_category: string;
  } | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    // 查询数据库验证用户是否存在且状态正常，同时加载用户组权限信息
    const admin = await this.adminRepository.findOne({
      where: { id: payload.sub, status: 1 },
      relations: ['adminGroup'],
    });

    if (!admin) {
      throw new UnauthorizedException('账户不存在或已被禁用');
    }

    return {
      id: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
      // 挂载用户组权限信息，供 PermissionsGuard 使用
      group_info: admin.adminGroup
        ? {
            rules: admin.adminGroup.rules || '',
            rules_category: admin.adminGroup.rules_category || '',
          }
        : null,
    };
  }
}