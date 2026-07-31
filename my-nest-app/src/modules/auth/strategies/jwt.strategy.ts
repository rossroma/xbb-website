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

  async validate(payload: JwtPayload) {
    // 查询数据库验证用户是否存在且状态正常
    const admin = await this.adminRepository.findOne({
      where: { id: payload.sub, status: 1 },
    });

    if (!admin) {
      throw new UnauthorizedException('账户不存在或已被禁用');
    }

    return {
      id: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
    };
  }
}