export class GalleryResponseDto {
  id: number;
  bid: number;
  title: string;
  subtitle?: string;
  simg: string;
  simg2?: string;
  descs: string;
  url: string;
  ord: number;
  content?: string;
  addtime?: number;
  formatted_addtime?: string;
}

export class Gallery2ResponseDto {
  id: number;
  bid: number;
  title: string;
  subtitle?: string;
  simg: string;
  descs: string;
  url: string;
  ord: number;
  content?: string;
  addtime?: number;
  formatted_addtime?: string;
}

export class Gallery3ResponseDto {
  id: number;
  bid: number;
  title: string;
  subtitle?: string;
  simg: string;
  descs: string;
  url: string;
  ord: number;
  content?: string;
  addtime?: number;
  formatted_addtime?: string;
}

export class ShowInfoResponseDto {
  id: number;
  bid: number;
  title: string;
  subtitle?: string;
  simg: string;
  descs: string;
  url: string;
  ord: number;
  content?: string;
  addtime?: number;
  formatted_addtime?: string;
}

export class GalleryListResponseDto {
  items: GalleryResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class Gallery2ListResponseDto {
  items: Gallery2ResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class Gallery3ListResponseDto {
  items: Gallery3ResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class ShowInfoListResponseDto {
  items: ShowInfoResponseDto[];
  total: number;
  page: number;
  limit: number;
}