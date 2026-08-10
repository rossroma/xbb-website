import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { SsrService } from './ssr.service';

/**
 * SSR 控制器
 *
 * 为搜索引擎爬虫提供预渲染的 HTML 页面。
 * 所有端点标记 @Public() 跳过 JWT 认证。
 */
@Controller('v1/ssr')
export class SsrController {
  constructor(private readonly ssrService: SsrService) {}

  /**
   * 文章详情页 SSR
   * GET /v1/ssr/gongsidongtai/:id
   */
  @Public()
  @Get('gongsidongtai/:id')
  async renderArticle(@Param('id') id: string, @Res() res: Response) {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).send('无效的文章 ID');
    }
    const html = await this.ssrService.renderArticle(numId);
    res.type('text/html; charset=utf-8').send(html);
  }

  /**
   * 案例详情页 SSR
   * GET /v1/ssr/hangyeanli/:id
   */
  @Public()
  @Get('hangyeanli/:id')
  async renderCase(@Param('id') id: string, @Res() res: Response) {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).send('无效的案例 ID');
    }
    const html = await this.ssrService.renderCase(numId);
    res.type('text/html; charset=utf-8').send(html);
  }

  /**
   * 知识问答详情页 SSR
   * GET /v1/ssr/zhishiwenda/:id
   */
  @Public()
  @Get('zhishiwenda/:id')
  async renderKnowledge(@Param('id') id: string, @Res() res: Response) {
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).send('无效的知识问答 ID');
    }
    const html = await this.ssrService.renderKnowledge(numId);
    res.type('text/html; charset=utf-8').send(html);
  }
}