import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import Handlebars from 'handlebars';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { ArticleService } from '../article/article.service';
import { CategoryService } from '../category/category.service';
import { SettingsService } from '../settings/settings.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { QueryTemplateDto } from './dto/query-template.dto';
import {
  TemplateResponseDto,
  TemplateListResponseDto,
  TemplatePreviewDto,
  TemplateApplyDto,
  TemplatePreviewRequestDto,
  TemplateContentDto,
  TemplateSampleDataDto,
  ClientPageRenderResponseDto,
  TemplatePublishDto,
} from './dto/template-response.dto';
import { Article } from '../article/entities/article.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class TemplateService {
  private readonly templatesDir = join(process.cwd(), 'uploads', 'templates');

  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private settingsService: SettingsService,
  ) { }

  // 创建模板
  async create(createTemplateDto: CreateTemplateDto): Promise<TemplateResponseDto> {
    const template = this.templateRepository.create(createTemplateDto);
    const savedTemplate = await this.templateRepository.save(template);
    return this.formatTemplateResponse(savedTemplate);
  }

  // 获取模板列表
  async findAll(query: QueryTemplateDto): Promise<TemplateListResponseDto> {
    const { page = 1, limit = 10, keyword, type, status, sort = 'id', order = 'DESC' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    if (keyword) {
      queryBuilder.andWhere(
        '(template.title LIKE :keyword OR template.descs LIKE :keyword OR template.template_name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (type) {
      queryBuilder.andWhere('template.type = :type', { type });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('template.status = :status', { status });
    }

    queryBuilder.orderBy(`template.${sort}`, order);
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items: items.map((item) => this.formatTemplateResponse(item)),
      total,
      page,
      limit,
    };
  }

  // 获取模板详情
  async findOne(id: number): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('模板不存在');
    }
    return this.formatTemplateResponse(template);
  }

  // 更新模板
  async update(id: number, updateTemplateDto: UpdateTemplateDto): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('模板不存在');
    }

    Object.assign(template, updateTemplateDto);
    const updatedTemplate = await this.templateRepository.save(template);
    return this.formatTemplateResponse(updatedTemplate);
  }

  // 删除模板
  async remove(id: number): Promise<void> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('模板不存在');
    }
    await this.templateRepository.remove(template);
  }

  // 获取模板源码
  async getContent(id: number): Promise<TemplateContentDto> {
    const template = await this.getTemplateOrThrow(id);
    const templateName = this.getTemplateNameOrThrow(template);

    await this.ensureTemplatesDir();
    const filePath = this.getTemplateFilePath(templateName);

    let content = '';
    try {
      content = await readFile(filePath, 'utf-8');
    } catch (error) {
      if (!this.isFileNotFound(error)) {
        throw error;
      }
      content = this.getDefaultTemplateContent(template);
      await writeFile(filePath, content, 'utf-8');
    }

    return {
      id: template.id,
      title: template.title,
      template_name: template.template_name,
      content,
    };
  }

  async getSampleData(
    id: number,
    options?: {
      mode?: string;
      categoryEnglish?: string;
      categoryId?: number;
      articleId?: number;
    },
  ): Promise<TemplateSampleDataDto> {
    const template = await this.getTemplateOrThrow(id);

    const [base, setting] = await Promise.all([
      this.settingsService.findBaseEntity(),
      this.settingsService.findSettingEntity(),
    ]);

    const category = await this.pickCategoryForSample(options);

    const mode = this.normalizeSampleMode(options?.mode, template.type);
    const pageSize = category?.pagesize || 10;

    const { article, items, total } = await this.pickArticleAndItemsForSample({
      mode,
      categoryId: category?.id,
      pageSize,
      articleId: options?.articleId,
    });

    const siteTitle = base?.title || '演示站点';
    const site = {
      title: base?.title || siteTitle,
      keyword: base?.keyword || '',
      descs: base?.descs || '',
      company: base?.company || '',
      logo: base?.logo || '',
      tel: base?.tel || '',
      phone: base?.phone || '',
      email: base?.email || '',
      address: base?.address || '',
    };

    const baseData: Record<string, any> = {
      title: template.title || siteTitle,
      description: template.descs || base?.descs || '示例描述',
      site_name: siteTitle,
      site,
      setting: setting ? { is_wap_open: setting.is_wap_open, is_english_open: setting.is_english_open } : {},
    };

    const categoryData = category
      ? {
          id: category.id,
          title: category.title,
          english: category.english,
          type: category.type,
          pagesize: category.pagesize,
          template_list: category.template_list,
          template_view: category.template_view,
          descs: category.descs,
          banner: category.banner,
          content: category.content,
          content2: category.content2,
        }
      : null;

    const articleData = article
      ? {
          id: article.id,
          title: article.title,
          descs: article.descs,
          content: article.content,
          simg: article.simg,
          addtime: article.addtime,
          author: article.author,
          bid: article.bid,
        }
      : null;

    const itemData = items.map((it) => ({
      id: it.id,
      title: it.title,
      descs: it.descs,
      simg: it.simg,
      addtime: it.addtime,
      bid: it.bid,
    }));

    const pagination = {
      page: 1,
      pageSize,
      total,
    };

    const data: Record<string, any> = {
      ...baseData,
      mode,
      category: mode === 'global' ? null : categoryData,
      article: mode === 'detail' ? articleData : null,
      items: mode === 'list' ? itemData : [],
      pagination: mode === 'list' ? pagination : { page: 1, pageSize, total: 0 },
    };

    return { templateId: template.id, data };
  }

  private normalizeSampleMode(mode: string | undefined, templateType: string | undefined): 'global' | 'list' | 'detail' | 'page' {
    const normalized = (mode || '').trim().toLowerCase();
    if (normalized === 'list' || normalized === 'detail' || normalized === 'page' || normalized === 'global') {
      return normalized;
    }
    if (templateType === 'list') {
      return 'list';
    }
    return 'page';
  }

  private async pickCategoryForSample(options?: { categoryEnglish?: string; categoryId?: number }): Promise<Category | null> {
    const categoryEnglish = (options?.categoryEnglish || '').trim();
    const categoryId = options?.categoryId;

    if (categoryId && Number.isFinite(categoryId)) {
      const byId = await this.categoryService.findOne(categoryId);
      if (byId) {
        // 返回原始实体：需要重新查询
        return await this.categoryService.findEnabledCategoryBySlug(
          (await this.categoryService.findOne(categoryId)).english || '',
        ) || await this.categoryService.findFirstEnabledCategory();
      }
    }

    if (categoryEnglish) {
      const byEnglish = await this.categoryService.findEnabledCategoryBySlug(categoryEnglish);
      if (byEnglish) return byEnglish;
    }

    return this.categoryService.findFirstEnabledCategory();
  }

  private async pickArticleAndItemsForSample(params: {
    mode: 'global' | 'list' | 'detail' | 'page';
    categoryId?: number;
    pageSize: number;
    articleId?: number;
  }): Promise<{ article: Article | null; items: Article[]; total: number }> {
    const { mode, categoryId, pageSize, articleId } = params;

    if (mode === 'global') {
      return { article: null, items: [], total: 0 };
    }

    if (mode === 'detail') {
      if (articleId && Number.isFinite(articleId)) {
        const byId = await this.articleService.findEnabledArticleById(articleId);
        if (byId && (!categoryId || byId.bid === categoryId)) {
          return { article: byId, items: [], total: 0 };
        }
      }

      const article = await this.articleService.findFirstEnabledArticle(categoryId);
      return { article: article || null, items: [], total: 0 };
    }

    if (mode === 'list') {
      if (categoryId) {
        const { items, total } = await this.articleService.findEnabledArticlesByBid(categoryId, 0, pageSize);
        return { article: null, items, total };
      }
      return { article: null, items: [], total: 0 };
    }

    return { article: null, items: [], total: 0 };
  }

  async renderClientPage(english: string, id?: number, page = 1): Promise<ClientPageRenderResponseDto> {
    const normalizedEnglish = (english || '').trim();
    if (!normalizedEnglish) {
      throw new BadRequestException('栏目英文名称不能为空');
    }

    const category = await this.categoryService.findEnabledCategoryBySlug(normalizedEnglish);
    if (!category) {
      throw new NotFoundException('栏目不存在或已下线');
    }

    const templateKey = id
      ? category.template_view
      : (category.type === 'page' ? category.template_view : category.template_list);

    const template = await this.findEnabledTemplateByKey(templateKey);
    const templateContent = (await this.getContent(template.id)).content;

    const [base, setting] = await Promise.all([
      this.settingsService.findBaseEntity(),
      this.settingsService.findSettingEntity(),
    ]);

    const siteTitle = base?.title || '演示站点';
    const site = {
      title: base?.title || siteTitle,
      keyword: base?.keyword || '',
      descs: base?.descs || '',
      company: base?.company || '',
      logo: base?.logo || '',
      tel: base?.tel || '',
      phone: base?.phone || '',
      email: base?.email || '',
      address: base?.address || '',
    };

    const currentPage = Math.max(1, page);
    const pageSize = category.pagesize || 10;

    const data: Record<string, any> = {
      site_name: siteTitle,
      site,
      setting: setting ? { is_wap_open: setting.is_wap_open, is_english_open: setting.is_english_open } : {},
      category: {
        id: category.id,
        title: category.title,
        english: category.english,
        type: category.type,
        pagesize: category.pagesize,
        template_list: category.template_list,
        template_view: category.template_view,
        descs: category.descs,
        banner: category.banner,
        content: category.content,
        content2: category.content2,
      },
      pagination: { page: currentPage, pageSize, total: 0 },
      items: [],
      article: null,
      title: category.title || siteTitle,
      description: category.descs || base?.descs || '',
    };

    if (id) {
      const article = await this.articleService.findEnabledArticleById(id);
      if (!article) {
        throw new NotFoundException('文章不存在或已下线');
      }
      if (article.bid !== category.id) {
        throw new NotFoundException('文章不属于该栏目');
      }

      data.article = {
        id: article.id,
        title: article.title,
        descs: article.descs,
        content: article.content,
        simg: article.simg,
        addtime: article.addtime,
        author: article.author,
        bid: article.bid,
        hit: article.hit,
      };
      data.title = article.title || data.title;
      data.description = article.descs || data.description;
    } else if (category.type === 'list') {
      const skip = (currentPage - 1) * pageSize;
      const { items, total } = await this.articleService.findEnabledArticlesByBid(category.id, skip, pageSize);

      data.items = items.map((it) => ({
        id: it.id,
        title: it.title,
        descs: it.descs,
        simg: it.simg,
        addtime: it.addtime,
        bid: it.bid,
        hit: it.hit,
        author: it.author,
      }));

      data.pagination = { page: currentPage, pageSize, total };
    }

    return {
      templateId: template.id,
      templateName: template.template_name,
      templateContent,
      data,
    };
  }

  // 保存模板源码
  async saveContent(id: number, content: string): Promise<TemplateContentDto> {
    if (typeof content !== 'string' || !content.trim()) {
      throw new BadRequestException('模板内容不能为空');
    }

    const template = await this.getTemplateOrThrow(id);
    const templateName = this.getTemplateNameOrThrow(template);

    this.validateTemplateSyntax(content);

    await this.ensureTemplatesDir();
    const filePath = this.getTemplateFilePath(templateName);
    await writeFile(filePath, content, 'utf-8');

    return {
      id: template.id,
      title: template.title,
      template_name: template.template_name,
      content,
    };
  }

  // 预览模板
  async preview(id: number, previewRequest?: TemplatePreviewRequestDto): Promise<TemplatePreviewDto> {
    const template = await this.getTemplateOrThrow(id);

    const fallback = await this.getContent(id);
    const sourceContent = previewRequest?.content?.trim() ? previewRequest.content : fallback.content;
    const variables = {
      ...this.getDefaultPreviewVariables(template),
      ...(previewRequest?.data || {}),
    };

    this.validateTemplateSyntax(sourceContent);

    const compiled = Handlebars.compile(sourceContent);
    const rendered = compiled(variables);

    return {
      id: template.id,
      title: template.title,
      content: rendered,
      variables,
      preview_url: template.link || `/preview/${template.id}`,
    };
  }

  // 应用模板（兼容旧按钮，转发到发布）
  async apply(id: number): Promise<TemplateApplyDto> {
    const publishResult = await this.publish(id);
    return {
      id: publishResult.id,
      title: publishResult.title,
      applied: publishResult.published,
      message: publishResult.published ? '模板应用成功' : publishResult.message,
    };
  }

  // 发布模板
  async publish(id: number): Promise<TemplatePublishDto> {
    const template = await this.getTemplateOrThrow(id);

    if (template.status !== 1) {
      throw new BadRequestException('模板未启用，无法发布');
    }

    const content = await this.getContent(id);
    this.validateTemplateSyntax(content.content);

    // 发布前做一次渲染检查，确保变量替换过程无异常
    const compiled = Handlebars.compile(content.content);
    compiled(this.getDefaultPreviewVariables(template));

    if (!template.link && template.template_name) {
      template.link = `/templates/${template.template_name}`;
      await this.templateRepository.save(template);
    }

    return {
      id: template.id,
      title: template.title,
      published: true,
      message: '模板发布成功',
    };
  }

  // 获取当前模板（客户端接口）
  async getCurrentTemplate(): Promise<TemplateResponseDto | null> {
    const template = await this.templateRepository.findOne({
      where: { status: 1 },
      order: { id: 'DESC' },
    });

    return template ? this.formatTemplateResponse(template) : null;
  }

  // 客户端获取模板详情
  async findOneForClient(id: number): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne({
      where: { id, status: 1 },
    });
    if (!template) {
      throw new NotFoundException('模板不存在或未启用');
    }
    return this.formatTemplateResponse(template);
  }

  private async getTemplateOrThrow(id: number): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('模板不存在');
    }
    return template;
  }

  private async findEnabledTemplateByKey(key: string): Promise<Template> {
    const normalized = (key || '').trim();
    if (!normalized) {
      throw new BadRequestException('栏目未配置模板');
    }

    let template = await this.templateRepository.findOne({
      where: { template_name: normalized, status: 1 },
    });

    if (!template) {
      template = await this.templateRepository.findOne({
        where: { title: normalized, status: 1 },
      });
    }

    if (!template) {
      throw new NotFoundException('模板不存在或未启用');
    }

    if (!template.template_name || !template.template_name.trim()) {
      throw new BadRequestException('模板缺少 template_name');
    }

    return template;
  }

  private getTemplateNameOrThrow(template: Template): string {
    const templateName = (template.template_name || '').trim();
    if (!templateName) {
      throw new BadRequestException('请先设置模板标识 template_name');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(templateName)) {
      throw new BadRequestException('模板标识仅支持字母、数字、下划线和中划线');
    }

    return templateName;
  }

  private getTemplateFilePath(templateName: string): string {
    const dir = resolve(this.templatesDir);
    const filePath = resolve(dir, `${templateName}.hbs`);

    if (!filePath.startsWith(`${dir}/`) && filePath !== dir) {
      throw new BadRequestException('模板路径非法');
    }

    return filePath;
  }

  private async ensureTemplatesDir(): Promise<void> {
    await mkdir(this.templatesDir, { recursive: true });
  }

  private validateTemplateSyntax(content: string): void {
    try {
      Handlebars.compile(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知语法错误';
      throw new BadRequestException(`模板语法错误: ${message}`);
    }
  }

  private getDefaultTemplateContent(template: Template): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{title}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f6f8fa; }
    .container { max-width: 960px; margin: 0 auto; background: #fff; padding: 24px; border: 1px solid #e5e7eb; }
    h1 { margin-top: 0; }
    .meta { color: #6b7280; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>{{title}}</h1>
    <div class="meta">模板类型：${template.type === 'list' ? '列表模板' : '单页模板'}</div>
    <p>{{description}}</p>
    {{#if items}}
      <ul>
      {{#each items}}
        <li>{{this.title}}</li>
      {{/each}}
      </ul>
    {{/if}}
  </div>
</body>
</html>`;
  }

  private getDefaultPreviewVariables(template: Template): Record<string, any> {
    const base = {
      title: template.title || '模板标题',
      description: template.descs || '这里是模板描述示例内容',
      site_name: '演示站点',
    } as Record<string, any>;

    if (template.type === 'list') {
      base.items = [
        { title: '示例列表项 1' },
        { title: '示例列表项 2' },
        { title: '示例列表项 3' },
      ];
    }

    return base;
  }

  private isFileNotFound(error: unknown): boolean {
    return !!error && typeof error === 'object' && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT';
  }

  // 格式化模板响应数据
  private formatTemplateResponse(template: Template): TemplateResponseDto {
    return {
      id: template.id,
      title: template.title,
      type: template.type,
      remarks: template.remarks,
      category_remarks: template.category_remarks,
      link: template.link,
      descs: template.descs,
      template_name: template.template_name,
      simg: template.simg,
      status: template.status,
      attribute_type: template.attribute_type,
      attribute: template.attribute,
      status_text: this.getStatusText(template.status),
      type_text: this.getTypeText(template.type),
    };
  }

  // 获取状态文本
  private getStatusText(status: number): string {
    const statusMap = {
      0: '禁用',
      1: '启用',
    };
    return statusMap[status] || '未知';
  }

  // 获取类型文本
  private getTypeText(type: string): string {
    const typeMap = {
      page: '单页模板',
      list: '列表模板',
    };
    return typeMap[type] || '未知类型';
  }
}