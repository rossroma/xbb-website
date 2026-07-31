export class ArticleResponseDto {
  id: number;
  title: string;
  title_en?: string;
  subtitle?: string;
  bid?: number;
  flag?: string;
  simg: string;
  author: string;
  source: string;
  descs: string;
  content?: string;
  seoTitle: string;
  seoKeyword: string;
  setDescription: string;
  status: number;
  ord: number;
  hit?: number;
  addtime?: number;
  updatetime?: number;

  constructor(article: any, includeContent = true) {
    this.id = article.id;
    this.title = article.title;
    this.title_en = article.title_en;
    this.subtitle = article.subtitle;
    this.bid = article.bid;
    this.flag = article.flag;
    this.simg = article.simg;
    this.author = article.author;
    this.source = article.source;
    this.descs = article.descs;
    this.seoTitle = article.seoTitle;
    this.seoKeyword = article.seoKeyword;
    this.setDescription = article.setDescription;
    this.status = article.status;
    this.ord = article.ord;
    this.hit = article.hit;
    this.addtime = article.addtime;
    this.updatetime = article.updatetime;

    // 根据需要决定是否包含内容（列表页通常不包含）
    if (includeContent) {
      this.content = article.content;
    }
  }
}

/** 上一篇/下一篇导航信息 */
export class ArticleNavInfo {
  id: number;
  title: string;

  constructor(article: { id: number; title: string }) {
    this.id = article.id;
    this.title = article.title;
  }
}

/** 文章详情 + 上下篇导航响应 */
export class ArticleDetailWithNavDto {
  article: ArticleResponseDto;
  prev: ArticleNavInfo | null;
  next: ArticleNavInfo | null;

  constructor(article: ArticleResponseDto, prev: ArticleNavInfo | null, next: ArticleNavInfo | null) {
    this.article = article;
    this.prev = prev;
    this.next = next;
  }
}

export class ArticleListResponseDto {
  items: ArticleResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(items: any[], total: number, page: number, limit: number) {
    this.items = items.map(item => new ArticleResponseDto(item, false));
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}