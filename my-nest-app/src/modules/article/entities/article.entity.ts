import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: true, comment: '标题' })
  title: string;

  @Column({ length: 300, nullable: true, comment: '英文名称' })
  title_en: string;

  @Column({ length: 200, nullable: true, comment: '副标题' })
  subtitle: string;

  @Column({ type: 'mediumint', nullable: true, comment: '栏目ID' })
  bid: number;

  @Column({ length: 300, nullable: true, comment: '推荐标识' })
  flag: string;

  @Column({ length: 200, default: '', comment: '缩略图' })
  simg: string;

  @Column({ length: 200, default: '', comment: 'Logo 图片' })
  logo: string;

  @Column({ length: 300, default: '', comment: '标签（逗号分隔）' })
  tags: string;

  @Column({ type: 'int', nullable: true, comment: '发布者ID' })
  publisher_id: number;

  @Column({ type: 'int', nullable: true, comment: '访问量' })
  hit: number;

  @Column({ type: 'mediumint', default: 10, comment: '排序' })
  ord: number;

  @Column({ length: 30, default: '', comment: '作者' })
  author: string;

  @Column({ length: 30, default: '', comment: '来源' })
  source: string;

  @Column({ length: 300, default: '', comment: '描述' })
  descs: string;

  @Column({ type: 'longtext', nullable: true, comment: '详细内容' })
  content: string;

  @Column({ length: 100, default: '' })
  seoTitle: string;

  @Column({ length: 100, default: '' })
  seoKeyword: string;

  @Column({ length: 100, default: '' })
  setDescription: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态:显示:1;不显示0:-1回收站' })
  status: number;

  @Column({ type: 'smallint', default: 0, comment: '是否允许删除 1:不允许;0:允许' })
  is_delete: number;

  @Column({ type: 'int', nullable: true, comment: '定时显示时间' })
  display_time: number;

  @Column({ type: 'int', nullable: true, comment: '发布时间' })
  addtime: number;

  @Column({ type: 'int', nullable: true })
  updatetime: number;
}