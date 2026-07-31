export class BaseResponseDto {
  id: number;
  title: string;
  keyword: string;
  descs: string;
  QQ?: string;
  content?: string;
  content2?: string;
  QQName?: string;
  isQQ?: string;
  hot_kwd?: string;
  company?: string;
  logo?: string;
  wap_logo?: string;
  ico_logo?: string;
  tel?: string;
  address?: string;
  video?: string;
  toolscode_bottom?: string;
  phone?: string;
  fax?: string;
  email?: string;
  postcode?: string;
  hot_online?: string;
  download?: string;
  toolscode_top?: string;
  wap_content?: string;
  keyreplace?: string;
  send_email?: string;
  weibo_simg?: string;
  weixin_simg?: string;
  douyin_simg?: string;
  wxurl?: string;
  wxappid?: string;
  wxappsecret?: string;
}

export class SettingResponseDto {
  id: number;
  is_banner: number;
  is_banner_url: number;
  is_english_open: number;
  is_wap_open: number;
  is_wap_banner: number;
  is_wap_banner_url: number;
  is_keyreplace: number;
  is_tags?: number;
  is_open_cache: number;
  is_open_close: number;
  logo_size?: string;
  banner_size?: string;
  wap_banner_size?: string;
  show_imgs_size?: string;
}

export class AllSettingsResponseDto {
  base: BaseResponseDto;
  setting: SettingResponseDto;
}

export class SiteInfoResponseDto {
  title: string;
  keyword: string;
  descs: string;
  company?: string;
  logo?: string;
  tel?: string;
  phone?: string;
  email?: string;
  address?: string;
  content2?: string;
}
