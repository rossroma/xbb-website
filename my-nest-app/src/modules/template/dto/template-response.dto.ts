import { IsObject, IsOptional, IsString } from 'class-validator';

export class TemplateResponseDto {
  id: number;
  title: string;
  type: string;
  remarks?: string;
  category_remarks?: string;
  link?: string;
  descs: string;
  template_name?: string;
  simg?: string;
  status: number;
  attribute_type: string;
  attribute?: string;
  status_text?: string;
  type_text?: string;
}

export class TemplateListResponseDto {
  items: TemplateResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class TemplatePreviewDto {
  id: number;
  title: string;
  content: string;
  variables: Record<string, any>;
  preview_url?: string;
}

export class TemplatePreviewRequestDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class TemplateContentDto {
  id: number;
  title: string;
  template_name?: string;
  content: string;
}

export class TemplateSampleDataDto {
  templateId: number;
  data: Record<string, any>;
}

export class TemplateApplyDto {
  id: number;
  title: string;
  applied: boolean;
  message: string;
}

export class TemplatePublishDto {
  id: number;
  title: string;
  published: boolean;
  message: string;
}

export class ClientPageRenderResponseDto {
  templateId: number;
  templateName: string;
  templateContent: string;
  data: Record<string, any>;
}
