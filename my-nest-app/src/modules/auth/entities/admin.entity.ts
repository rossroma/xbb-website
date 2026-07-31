import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AdminGroup } from './admin-group.entity';

@Entity('web_admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, nullable: true, comment: '用户名' })
  username: string;

  @Column({ length: 60, nullable: true, comment: '密码' })
  userpwd: string;

  @Column({ length: 6, default: '', comment: '验证码' })
  salt: string;

  @Column({ type: 'smallint', default: 0, comment: '状态' })
  status: number;

  @Column({ type: 'smallint', default: 0, comment: '类型:0普通用户1管理员' })
  type: number;

  @Column({ type: 'tinyint', nullable: true, comment: '用户组ID' })
  group_id: number;

  @ManyToOne(() => AdminGroup)
  @JoinColumn({ name: 'group_id' })
  adminGroup?: AdminGroup;
}