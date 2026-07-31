import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_base')
export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300, default: '', comment: '网站名称' })
  title: string;

  @Column({ type: 'varchar', length: 300, default: '', comment: '关键词' })
  keyword: string;

  @Column({ type: 'varchar', length: 300, default: '', comment: '描述' })
  descs: string;

  @Column({ type: 'varchar', length: 60, default: '', comment: '在线客服' })
  QQ: string;

  @Column({ type: 'text', nullable: true, comment: '内容' })
  content: string;

  @Column({ type: 'text', nullable: true, comment: '底部版权' })
  content2: string;

  @Column({ type: 'varchar', length: 60, default: '', comment: '客服名称' })
  QQName: string;

  @Column({ type: 'varchar', length: 2, nullable: true, comment: '开启QQ' })
  isQQ: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '热门关键词' })
  hot_kwd: string;

  @Column({ type: 'varchar', length: 150, nullable: true, comment: '公司名称' })
  company: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: 'Pclogo' })
  logo: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '手机站logo' })
  wap_logo: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ico_logo: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '手机' })
  tel: string;

  @Column({ type: 'varchar', length: 250, nullable: true, comment: '地址' })
  address: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '视频地址' })
  video: string;

  @Column({ type: 'text', nullable: true, comment: '底部统计工具' })
  toolscode_bottom: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '电话' })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '传真' })
  fax: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  postcode: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '在线咨询' })
  hot_online: string;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '下载资料' })
  download: string;

  @Column({ type: 'text', nullable: true, comment: '头部统计工具' })
  toolscode_top: string;

  @Column({ type: 'text', nullable: true, comment: '手机站内容' })
  wap_content: string;

  @Column({ type: 'text', nullable: true, comment: '替换关键词' })
  keyreplace: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  send_email: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '微博图片' })
  weibo_simg: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '微信图片' })
  weixin_simg: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  douyin_simg: string;

  @Column({ type: 'varchar', length: 150, nullable: true, comment: '微信地址' })
  wxurl: string;

  @Column({ type: 'varchar', length: 150, nullable: true, comment: '微信appid' })
  wxappid: string;

  @Column({ type: 'varchar', length: 150, nullable: true, comment: '微信秘钥' })
  wxappsecret: string;
}
