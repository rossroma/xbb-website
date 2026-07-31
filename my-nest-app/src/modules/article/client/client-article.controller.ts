import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticleService } from '../article.service';
import { QueryArticleDto } from '../dto/query-article.dto';
import { ArticleResponseDto, ArticleListResponseDto, ArticleDetailWithNavDto } from '../dto/article-response.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { ResponseResult } from '../../../common/interfaces/response.interface';

@Controller('v1/client/articles')
@Public()
export class ClientArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get()
  async findAll(@Query() queryDto: QueryArticleDto): Promise<ResponseResult<ArticleListResponseDto>> {
    const result = await this.articleService.findAllForClient(queryDto);
    return ResponseResult.success(result, '获取文章列表成功');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<ArticleResponseDto>> {
    const result = await this.articleService.findOneForClient(id);
    return ResponseResult.success(result, '获取文章详情成功');
  }

  @Get(':id/detail')
  async findOneDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<ArticleDetailWithNavDto>> {
    const result = await this.articleService.findOneForClientWithNavigation(id);
    return ResponseResult.success(result, '获取文章详情成功');
  }
}