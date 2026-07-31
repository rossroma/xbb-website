import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_admin_groups')
export class AdminGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, default: '', comment: '用户组中文名称' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '用户组拥有的规则id' })
  rules: string;

  @Column({ type: 'text', nullable: true, comment: '栏目权限管理' })
  rules_category: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:1:显示0:不显示' })
  status: number;
}