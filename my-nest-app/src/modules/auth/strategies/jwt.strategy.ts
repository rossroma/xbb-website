import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number;
  username: string;
  type: number;
  group_id: number;
  /** 用户组权限规则（逗号分隔的 action_code），嵌入 JWT 避免每次请求查库 */
  group_rules?: string;
  /** 用户组分类权限规则 */
  group_rules_category?: string;
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
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    return {
      id: payload.sub,
      username: payload.username,
      type: payload.type,
      group_id: payload.group_id,
      group_info: payload.group_rules !== undefined
        ? {
            rules: payload.group_rules || '',
            rules_category: payload.group_rules_category || '',
          }
        : null,
    };
  }
}