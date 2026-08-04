import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from '../article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { QueryArticleDto } from '../dto/query-article.dto';
import { BatchArticleDto } from '../dto/batch-article.dto';
import { ArticleResponseDto, ArticleListResponseDto } from '../dto/article-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ResponseResult } from '../../../common/interfaces/response.interface';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin/articles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
@RequirePermissions('article', 'category')
export class AdminArticleController {
  constructor(private readonly articleService: ArticleService) { }

  // ==================== 批量操作（静态路径，必须在 :id 之前） ====================

  @Patch('batch/restore')
  @OperationLog({ title: '文章', type: 2, titlePrefix: '文章：' })
  async batchRestore(@Body() dto: BatchArticleDto): Promise<ResponseResult<number>> {
    const count = await this.articleService.batchRestore(dto.ids);
    return ResponseResult.success(count, `成功恢复 ${count} 篇文章`);
  }

  @Delete('batch/permanent')
  @OperationLog({ title: '文章', type: 3, titlePrefix: '文章：' })
  async batchPermanentDelete(@Body() dto: BatchArticleDto): Promise<ResponseResult<number>> {
    const count = await this.articleService.batchPermanentDelete(dto.ids);
    return ResponseResult.success(count, `成功彻底删除 ${count} 篇文章`);
  }

  // ==================== 辅助接口 ====================

  @Get('counts')
  async getCounts(): Promise<ResponseResult<Record<number, number>>> {
    const result = await this.articleService.getArticleCounts();
    return ResponseResult.success(result, '获取文章统计成功');
  }

  // ==================== CRUD ====================

  @Post()
  @OperationLog({ title: '文章', type: 1, targetFields: ['title'], titlePrefix: '文章：' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: any,
  ): Promise<ResponseResult<ArticleResponseDto>> {
    const result = await this.articleService.create(createArticleDto, user.id);
    return ResponseResult.success(result, '文章创建成功');
  }

  @Get()
  async findAll(@Query() queryDto: QueryArticleDto): Promise<ResponseResult<ArticleListResponseDto>> {
    const result = await this.articleService.findAll(queryDto);
    return ResponseResult.success(result, '获取文章列表成功');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<ArticleResponseDto>> {
    const result = await this.articleService.findOne(id);
    return ResponseResult.success(result, '获取文章详情成功');
  }

  @Patch(':id')
  @OperationLog({ title: '文章', type: 2, targetFields: ['title'], titlePrefix: '文章：' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ResponseResult<ArticleResponseDto>> {
    const result = await this.articleService.update(id, updateArticleDto);
    return ResponseResult.success(result, '文章更新成功');
  }

  @Delete(':id')
  @OperationLog({ title: '文章', type: 3, targetFields: ['title'], titlePrefix: '文章：' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<ArticleResponseDto>> {
    const target = await this.articleService.findOne(id);
    await this.articleService.remove(id);
    return ResponseResult.success(target, '文章已移入回收站');
  }

  @Patch(':id/restore')
  @OperationLog({ title: '文章', type: 2, targetFields: ['title'], titlePrefix: '文章：' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<null>> {
    await this.articleService.restore(id);
    return ResponseResult.success(null, '文章已恢复');
  }

  @Delete(':id/permanent')
  @OperationLog({ title: '文章', type: 3, targetFields: ['title'], titlePrefix: '文章：' })
  async permanentDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseResult<ArticleResponseDto>> {
    const target = await this.articleService.findOne(id);
    await this.articleService.permanentDelete(id);
    return ResponseResult.success(target, '文章已彻底删除');
  }
}