import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_template')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, default: '', comment: '模板名称' })
  title: string;

  @Column({ type: 'varchar', length: 20, default: 'page', comment: '模板类型:单页:page;列表:list' })
  type: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: 'PC缩略图尺寸' })
  remarks: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '栏目备注' })
  category_remarks: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '模板地址' })
  link: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: '备注信息' })
  descs: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '模板名称' })
  template_name: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '模板缩略图' })
  simg: string;

  @Column({ type: 'tinyint', default: 1, comment: '1:显示0:不显示' })
  status: number;

  @Column({ type: 'varchar', length: 300, default: '0,4,9,16', comment: '属性类型' })
  attribute_type: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '属性' })
  attribute: string;
}