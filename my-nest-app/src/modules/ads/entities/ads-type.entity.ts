import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_ads_type')
export class AdsType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, default: '', comment: '广告分类名称' })
  title: string;

  @Column({ type: 'varchar', length: 100, default: '0', comment: '宽度' })
  width_height: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '手机缩略图尺寸',
  })
  wap_width_height: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '缩略图2尺寸',
  })
  simg2_width_height: string;

  @Column({ type: 'int', default: 10, comment: '排序' })
  ord: number;

  @Column({ type: 'text', nullable: true, comment: '详细内容' })
  content: string;

  @Column({ type: 'text', nullable: true, comment: '手机站详细内容' })
  wap_content: string;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '是否显示缩略图:0:不显示1:显示',
  })
  is_img: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否显示缩略图2:0:不显示1:显示',
  })
  is_img2: number;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '是否显示手机缩略图:0:不显示1:显示',
  })
  is_img_wap: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否显示上传资料:0:不显示1:显示',
  })
  is_download: number;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '是否显示描述:0:不显示1:显示',
  })
  is_descs: number;

  @Column({ type: 'tinyint', default: 1, comment: '是否删除' })
  is_delete: number;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '是否显示链接地址:0:不显示1:显示',
  })
  is_url: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否显示副标题0:不显示1:显示',
  })
  is_subtitle: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否显示内容:0:不显示1:显示',
  })
  is_content: number;

  @Column({ type: 'tinyint', default: 1, comment: '是否显示:0:不显示1:显示' })
  is_show: number;
}
