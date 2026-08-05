import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_logs')
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: '', comment: '操作用户名' })
  username: string;

  @Column({ length: 200, nullable: true, comment: '操作名称/标题' })
  title: string;

  @Column({ type: 'smallint', default: 0, comment: '操作类型：1-新增，2-修改，3-删除' })
  type: number;

  @Column({ length: 30, nullable: true, comment: '操作 IP' })
  login_ip: string;

  @Column({ type: 'int', nullable: true, comment: '创建时间（Unix 时间戳）' })
  addtime: number;
}