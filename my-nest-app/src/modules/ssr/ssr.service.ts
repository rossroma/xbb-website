import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Article } from '../article/entities/article.entity';
import { Case } from '../case/entities/case.entity';

/**
 * SSR 渲染服务
 *
 * 为搜索引擎爬虫提供预渲染的 HTML 页面，包含完整的 SEO 标签和正文内容。
 * 使用 Handlebars 模板引擎渲染，无需浏览器/Puppeteer。
 */
@Injectable()
export class SsrService {
  private readonly logger = new Logger(SsrService.name);
  private readonly articleTemplate: HandlebarsTemplateDelegate;
  private readonly caseTemplate: HandlebarsTemplateDelegate;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
  ) {
    // 编译 Handlebars 模板
    const templatesDir = join(__dirname, 'templates');
    this.articleTemplate = Handlebars.compile(
      readFileSync(join(templatesDir, 'article.hbs'), 'utf-8'),
    );
    this.caseTemplate = Handlebars.compile(
      readFileSync(join(templatesDir, 'case.hbs'), 'utf-8'),
    );
    this.baseUrl = process.env.OSS_BASE_URL || 'https://www.xbongbong.com';
  }

  /**
   * 渲染文章详情页
   */
  async renderArticle(id: number): Promise<string> {
    const article = await this.articleRepo.findOne({
      where: { id, status: 1 },
    });

    if (!article) {
      return this.renderNotFound();
    }

    const title = article.seoTitle || `${article.title} - 销帮帮 CRM`;
    const description = article.setDescription || article.descs || '';
    const keywords = article.seoKeyword || '';
    const publishedAt = article.addtime
      ? new Date(article.addtime * 1000).toISOString().split('T')[0]
      : '';

    this.logger.log(`SSR 渲染文章: #${id} "${title}"`);

    return this.articleTemplate({
      title,
      description,
      keywords,
      content: article.content || '',
      author: article.author || '',
      publishedAt,
      canonicalUrl: `${this.baseUrl}/gongsidongtai/${id}`,
      jsonLd: this.generateArticleJsonLd(article),
    });
  }

  /**
   * 渲染案例详情页
   */
  async renderCase(id: number): Promise<string> {
    const caseItem = await this.caseRepo.findOne({
      where: { id, status: 1 },
    });

    if (!caseItem) {
      return this.renderNotFound();
    }

    const title = caseItem.seoTitle || `${caseItem.title} - 销帮帮 CRM`;
    const description = caseItem.seoDescription || caseItem.description || '';
    const keywords = caseItem.seoKeyword || '';

    this.logger.log(`SSR 渲染案例: #${id} "${title}"`);

    return this.caseTemplate({
      title,
      description,
      keywords,
      content: caseItem.content || '',
      image: caseItem.image || '',
      tags: caseItem.tags || '',
      canonicalUrl: `${this.baseUrl}/hangyeanli/${id}`,
      jsonLd: this.generateCaseJsonLd(caseItem),
    });
  }

  /**
   * 渲染知识问答详情页
   */
  async renderKnowledge(id: number): Promise<string> {
    const article = await this.articleRepo.findOne({
      where: { id, status: 1 },
    });

    if (!article) {
      return this.renderNotFound();
    }

    const title = article.seoTitle || `${article.title} - 知识问答 - 销帮帮 CRM`;
    const description = article.setDescription || article.descs || '';
    const keywords = article.seoKeyword || '';
    const publishedAt = article.addtime
      ? new Date(article.addtime * 1000).toISOString().split('T')[0]
      : '';

    this.logger.log(`SSR 渲染知识问答: #${id} "${title}"`);

    return this.articleTemplate({
      title,
      description,
      keywords,
      content: article.content || '',
      author: article.author || '',
      publishedAt,
      canonicalUrl: `${this.baseUrl}/zhishiwenda/${id}`,
      jsonLd: this.generateArticleJsonLd(article),
    });
  }

  /**
   * 404 友好页面
   */
  private renderNotFound(): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>页面不存在 - 销帮帮 CRM</title>
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>页面不存在</h1>
  <p>您访问的内容可能已被删除或移动。</p>
  <a href="/">返回首页</a>
</body>
</html>`;
  }

  /**
   * 生成文章 JSON-LD 结构化数据
   */
  private generateArticleJsonLd(article: Article): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.setDescription || article.descs,
      datePublished: article.addtime
        ? new Date(article.addtime * 1000).toISOString()
        : undefined,
      author: article.author
        ? { '@type': 'Person', name: article.author }
        : undefined,
    });
  }

  /**
   * 生成案例 JSON-LD 结构化数据
   */
  private generateCaseJsonLd(caseItem: Case): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: caseItem.title,
      description: caseItem.seoDescription || caseItem.description,
      image: caseItem.image || undefined,
      datePublished: caseItem.addtime
        ? new Date(caseItem.addtime * 1000).toISOString()
        : undefined,
    });
  }
}