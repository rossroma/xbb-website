import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('web_message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1, comment: '分类ID' })
  bid: number;

  @Column({ length: 200, nullable: true, comment: '标题' })
  title: string;

  @Column({ length: 50, nullable: true, comment: '姓名' })
  mname: string;

  @Column({ length: 100, nullable: true, comment: '地址' })
  address: string;

  @Column({ length: 50, nullable: true, comment: '手机号' })
  tel: string;

  @Column({ nullable: true, comment: '申请来源' })
  source_tid: number;

  @Column({ length: 30, default: '', comment: '邮箱' })
  email: string;

  @Column({ length: 5, nullable: true })
  age: string;

  @Column({ length: 300, nullable: true, comment: '描述' })
  descs: string;

  @Column({ type: 'tinyint', default: 0, comment: '审核状态：0未审核，1已审核，2已拒绝' })
  check_status: number;

  @Column({ type: 'tinyint', default: 0, comment: '读取状态：0未读，1已读' })
  read_status: number;

  @Column({ type: 'text', nullable: true, comment: '扩展信息' })
  extends: string;

  @Column({ length: 255, default: '', comment: '留言内容' })
  content: string;

  @Column({ nullable: true, comment: '发布时间' })
  addtime: number;

  @Column({ length: 200, nullable: true, comment: '来源' })
  source: string;

  @Column({ type: 'int', nullable: true, comment: '来源文章ID' })
  article_id: number;

  @Column({ type: 'int', nullable: true, comment: '文章评分' })
  article_score: number;

  @Column({ length: 50, default: '', comment: '公司规模' })
  scale: string;

  @Column({ length: 100, default: '', comment: '所属行业' })
  industry: string;
}