import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_ads')
export class Ads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, default: '', comment: '名称' })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '副标题' })
  subtitle: string;

  @Column({ type: 'varchar', length: 500, default: '', comment: '描述' })
  descs: string;

  @Column({ type: 'smallint', default: 0, comment: '广告位ID' })
  bid: number;

  @Column({ type: 'varchar', length: 100, default: '', comment: '外链地址' })
  url: string;

  @Column({ type: 'int', default: 10, comment: '排序' })
  ord: number;

  @Column({ type: 'varchar', length: 200, default: '', comment: '缩略图' })
  simg: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '缩略图2' })
  simg2: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '手机站缩略图' })
  wap_simg: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '缩略图图片尺寸',
  })
  width_height: string;

  @Column({ type: 'int', nullable: true })
  hit: number;

  @Column({ type: 'varchar', length: 300, nullable: true, comment: '上传资料' })
  download: string;

  @Column({ type: 'text', nullable: true, comment: '详细内容' })
  content: string;

  @Column({
    type: 'varchar',
    length: 8,
    default: '_blank',
    comment: '打开方式',
  })
  target: string;
}
