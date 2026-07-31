import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_category_type')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, nullable: true, comment: '名称' })
  title: string;

  @Column({ length: 100, default: 'Category', comment: '伪静态地址' })
  english: string;

  @Column({ length: 150, nullable: true, comment: '英文名称' })
  title_en: string;

  @Column({ length: 200, nullable: true, comment: '副标题' })
  subtitle: string;

  @Column({ type: 'mediumint', default: 0, comment: '所属分类ID' })
  pid: number;

  @Column({ length: 5, default: 'page', comment: '单页:page列表:list' })
  type: string;

  @Column({ length: 150, nullable: true, comment: '导航链接地址' })
  link: string;

  @Column({ length: 200, nullable: true, comment: '外链地址' })
  link_out: string;

  @Column({ type: 'int', default: 10, comment: '分页数量' })
  pagesize: number;

  @Column({ length: 50, default: 'news', comment: '列表页模板' })
  template_list: string;

  @Column({ length: 50, default: 'news_view', comment: '详情页模板' })
  template_view: string;

  @Column({ type: 'mediumint', default: 10, comment: '排序' })
  ord: number;

  @Column({ type: 'tinyint', default: 1, comment: '是否在导航显示1:显示 0:不显示' })
  is_nav: number;

  @Column({ type: 'smallint', default: 0, comment: '是否允许添加下级' })
  is_lower: number;

  @Column({ type: 'smallint', default: 1, comment: '是否允许删除' })
  is_delete: number;

  @Column({ length: 100, default: '', comment: 'seo标题' })
  seoTitle: string;

  @Column({ length: 200, default: '', comment: 'seo关键词' })
  seoKeyword: string;

  @Column({ length: 300, default: '', comment: 'seo描述' })
  setDescription: string;

  @Column({ length: 200, nullable: true, comment: '缩略图' })
  simg: string;

  @Column({ length: 200, nullable: true, comment: '栏目Banner图' })
  banner: string;

  @Column({ length: 200, nullable: true, comment: '手机站栏目Banner图' })
  wap_banner: string;

  @Column({ type: 'text', nullable: true, comment: '描述' })
  descs: string;

  @Column({ type: 'text', nullable: true, comment: '详细内容' })
  content: string;

  @Column({ type: 'text', nullable: true })
  content2: string;

  @Column({ type: 'tinyint', default: 1, comment: '0:不显示1:显示' })
  status: number;

  @Column({ type: 'int', nullable: true })
  addtime: number;

  @Column({ type: 'int', nullable: true, comment: '更新时间' })
  updatetime: number;
}
