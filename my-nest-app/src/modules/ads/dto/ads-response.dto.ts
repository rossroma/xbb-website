export class AdsResponseDto {
  id: number;
  title: string;
  subtitle?: string;
  descs?: string;
  bid: number;
  url?: string;
  ord: number;
  simg?: string;
  simg2?: string;
  wap_simg?: string;
  width_height?: string;
  hit?: number;
  download?: string;
  content?: string;
  target?: string;
}

export class AdsTypeResponseDto {
  id: number;
  title: string;
  width_height?: string;
  wap_width_height?: string;
  simg2_width_height?: string;
  ord: number;
  content?: string;
  wap_content?: string;
  is_img: number;
  is_img2: number;
  is_img_wap: number;
  is_download: number;
  is_descs: number;
  is_delete: number;
  is_url: number;
  is_subtitle: number;
  is_content: number;
  is_show: number;
}
