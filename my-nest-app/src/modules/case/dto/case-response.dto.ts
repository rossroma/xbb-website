/** 案例详情响应 DTO */
export class CaseResponseDto {
  id: number;
  title: string;
  description: string;
  image: string;
  logo: string;
  tags: string[];
  content?: string;
  seoTitle: string;
  seoKeyword: string;
  seoDescription: string;
  status: number;
  ord: number;
  hit?: number;
  addtime?: number;
  updatetime?: number;

  constructor(caseEntity: any, includeContent = true) {
    this.id = caseEntity.id;
    this.title = caseEntity.title;
    this.description = caseEntity.description;
    this.image = caseEntity.image;
    this.logo = caseEntity.logo;
    this.tags = caseEntity.tags
      ? caseEntity.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];
    this.seoTitle = caseEntity.seoTitle;
    this.seoKeyword = caseEntity.seoKeyword;
    this.seoDescription = caseEntity.seoDescription;
    this.status = caseEntity.status;
    this.ord = caseEntity.ord;
    this.hit = caseEntity.hit;
    this.addtime = caseEntity.addtime;
    this.updatetime = caseEntity.updatetime;

    if (includeContent) {
      this.content = caseEntity.content;
    }
  }
}

/** 上一篇/下一篇导航信息 */
export class CaseNavInfo {
  id: number;
  title: string;

  constructor(caseEntity: { id: number; title: string }) {
    this.id = caseEntity.id;
    this.title = caseEntity.title;
  }
}

/** 案例详情 + 上下篇导航 + 相关案例响应 */
export class CaseDetailWithNavDto {
  case: CaseResponseDto;
  prev: CaseNavInfo | null;
  next: CaseNavInfo | null;
  relatedCases: CaseResponseDto[];

  constructor(
    caseData: CaseResponseDto,
    prev: CaseNavInfo | null,
    next: CaseNavInfo | null,
    relatedCases: CaseResponseDto[],
  ) {
    this.case = caseData;
    this.prev = prev;
    this.next = next;
    this.relatedCases = relatedCases;
  }
}

/** 案例列表响应 DTO */
export class CaseListResponseDto {
  items: CaseResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(items: any[], total: number, page: number, limit: number) {
    this.items = items.map((item) => new CaseResponseDto(item, false));
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}