import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_show_info')
export class ShowInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint', default: 0, comment: '栏目ID' })
  bid: number;

  @Column({ type: 'varchar', length: 100, default: '', comment: '名称' })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '副标题' })
  subtitle: string;

  @Column({ type: 'varchar', length: 300, default: '', comment: '缩略图' })
  simg: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: '描述' })
  descs: string;

  @Column({ type: 'varchar', length: 100, default: '', comment: '链接地址' })
  url: string;

  @Column({ type: 'int', default: 10, comment: '排序' })
  ord: number;

  @Column({ type: 'text', nullable: true, comment: '内容' })
  content: string;

  @Column({ type: 'int', nullable: true, comment: '发布时间' })
  addtime: number;
}