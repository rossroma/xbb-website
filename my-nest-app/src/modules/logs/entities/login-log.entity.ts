import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_logins')
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, default: '', comment: '登录用户名' })
  username: string;

  @Column({ length: 30, nullable: true, comment: '登录 IP' })
  login_ip: string;

  @Column({ type: 'mediumint', default: 0, comment: '0普通用户 1管理员' })
  type: number;

  @Column({ length: 500, nullable: true, comment: '浏览器 User-Agent' })
  user_agent: string;

  @Column({ type: 'int', nullable: true, comment: '创建时间（Unix 时间戳）' })
  addtime: number;
}