import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 短信发送日志实体
 * 对应旧版 sms_logs 表
 */
@Entity('sms_logs')
export class SmsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '手机号' })
  @Index('idx_phone')
  phone: string;

  @Column({ length: 50, comment: 'IP 地址' })
  @Index('idx_ip')
  ip: string;

  @Column({ length: 20, comment: '状态：success / failed' })
  status: string;

  @Column({ length: 64, nullable: true, comment: '验证码 SHA256 哈希（审计去重，不可逆）' })
  code: string;

  @Column({ length: 255, nullable: true, comment: '错误信息' })
  errorMsg: string;

  @Column({ length: 500, nullable: true, comment: '客户端 User-Agent（用于安全审计）' })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  @Index('idx_created_at')
  created_at: Date;
}