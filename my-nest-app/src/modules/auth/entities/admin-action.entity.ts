import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_admin_action')
export class AdminAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint', default: 0, comment: '父级ID' })
  parent_id: number;

  @Column({ length: 60, default: '', comment: '权限名' })
  action_code: string;

  @Column({ length: 60, default: '', comment: '权限名称' })
  action_name: string;

  @Column({ type: 'smallint', default: 10, comment: '排序' })
  ord: number;

  @Column({ length: 60, nullable: true, comment: '访问地址' })
  url: string;

  @Column({ type: 'tinyint', default: 1, comment: '权限状态' })
  status: number;
}