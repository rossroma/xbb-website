export class CategoryResponseDto {
  id: number;
  title: string;
  english: string;
  title_en?: string;
  subtitle?: string;
  pid: number;
  type: string;
  link?: string;
  link_out?: string;
  pagesize: number;
  template_list: string;
  template_view: string;
  ord: number;
  is_nav: number;
  is_lower: number;
  is_delete: number;
  seoTitle: string;
  seoKeyword: string;
  setDescription: string;
  simg?: string;
  banner?: string;
  wap_banner?: string;
  descs?: string;
  content?: string;
  content2?: string;
  status: number;
  addtime?: number;
  updatetime?: number;

  constructor(category: any) {
    this.id = category.id;
    this.title = category.title;
    this.english = category.english;
    this.title_en = category.title_en;
    this.subtitle = category.subtitle;
    this.pid = category.pid;
    this.type = category.type;
    this.link = category.link;
    this.link_out = category.link_out;
    this.pagesize = category.pagesize;
    this.template_list = category.template_list;
    this.template_view = category.template_view;
    this.ord = category.ord;
    this.is_nav = category.is_nav;
    this.is_lower = category.is_lower;
    this.is_delete = category.is_delete;
    this.seoTitle = category.seoTitle;
    this.seoKeyword = category.seoKeyword;
    this.setDescription = category.setDescription;
    this.simg = category.simg;
    this.banner = category.banner;
    this.wap_banner = category.wap_banner;
    this.descs = category.descs;
    this.content = category.content;
    this.content2 = category.content2;
    this.status = category.status;
    this.addtime = category.addtime;
    this.updatetime = category.updatetime;
  }
}

export class CategoryListResponseDto {
  items: CategoryResponseDto[];
  total: number;

  constructor(items: any[], total: number) {
    this.items = items.map(item => new CategoryResponseDto(item));
    this.total = total;
  }
}
