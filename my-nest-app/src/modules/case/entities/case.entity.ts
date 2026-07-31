import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * 案例实体 — 复用 web_article 表，通过 bid=18（行业案例）区分
 * 字段映射：
 *   image → simg（配图）、description → descs（描述）、seoDescription → setDescription
 */
@Entity('web_article')
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bid', type: 'mediumint', nullable: true, comment: '栏目 ID' })
  bid: number;

  @Column({ length: 300, nullable: true, comment: '标题' })
  title: string;

  @Column({ name: 'descs', length: 300, default: '', comment: '简短描述' })
  description: string;

  @Column({ name: 'simg', length: 200, default: '', comment: '左侧配图 URL' })
  image: string;

  @Column({ length: 200, default: '', comment: '案例 logo URL' })
  logo: string;

  @Column({ length: 300, default: '', comment: '标签（逗号分隔）' })
  tags: string;

  @Column({ type: 'longtext', nullable: true, comment: '富文本正文' })
  content: string;

  @Column({ length: 100, default: '', comment: 'SEO 标题' })
  seoTitle: string;

  @Column({ length: 100, default: '', comment: 'SEO 关键词' })
  seoKeyword: string;

  @Column({ name: 'setDescription', length: 100, default: '', comment: 'SEO 描述' })
  seoDescription: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态: 1=显示, 0=隐藏, -1=回收站' })
  status: number;

  @Column({ type: 'mediumint', default: 10, comment: '排序' })
  ord: number;

  @Column({ type: 'int', nullable: true, comment: '访问量' })
  hit: number;

  @Column({ type: 'int', nullable: true, comment: '发布时间' })
  addtime: number;

  @Column({ type: 'int', nullable: true, comment: '更新时间' })
  updatetime: number;
}