import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 短信验证码存储实体
 *
 * 替代旧版 PHP Session 存储方式，用于无状态 NestJS 服务。
 * 验证码有效期 5 分钟，验证成功后即标记为已使用。
 */
@Entity('sms_codes')
export class SmsCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '手机号' })
  @Index('idx_phone')
  phone: string;

  @Column({ length: 10, comment: '验证码' })
  code: string;

  @Column({ type: 'tinyint', default: 0, comment: '是否已验证：0 未验证，1 已验证' })
  verified: number;

  @Column({ length: 50, comment: '客户端 IP' })
  ip: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  @Index('idx_created_at')
  created_at: Date;
}