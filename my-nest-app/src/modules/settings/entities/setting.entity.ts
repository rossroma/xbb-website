import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_setting')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint', default: 0, comment: '是否开启Banner' })
  is_banner: number;

  @Column({ type: 'tinyint', default: 0, comment: 'Banner图地址' })
  is_banner_url: number;

  @Column({ type: 'tinyint', default: 0, comment: '开启英文版' })
  is_english_open: number;

  @Column({ type: 'tinyint', default: 0, comment: '开始手机版' })
  is_wap_open: number;

  @Column({ type: 'tinyint', default: 0, comment: '手机站Banner' })
  is_wap_banner: number;

  @Column({ type: 'tinyint', default: 0, comment: '手机站Banner链接' })
  is_wap_banner_url: number;

  @Column({ type: 'tinyint', default: 0, comment: '0:关闭1:开启' })
  is_keyreplace: number;

  @Column({ type: 'tinyint', nullable: true })
  is_tags: number;

  @Column({ type: 'tinyint', default: 0, comment: '0:不开启;1:开启' })
  is_open_cache: number;

  @Column({ type: 'tinyint', default: 0, comment: '0' })
  is_open_close: number;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: 'Logo尺寸' })
  logo_size: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: 'Banner图尺寸' })
  banner_size: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '手机Banner图尺寸',
  })
  wap_banner_size: string;

  @Column({ type: 'varchar', length: 200, default: '', comment: '图片集尺寸' })
  show_imgs_size: string;
}
