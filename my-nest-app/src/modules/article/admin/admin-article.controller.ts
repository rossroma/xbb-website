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
import { ArticleResponseDto, ArticleListResponseDto } from '../dto/article-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ResponseResult } from '../../../common/interfaces/response.interface';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin/articles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
export class AdminArticleController {
  constructor(private readonly articleService: ArticleService) { }

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
    return ResponseResult.success(target, '文章删除成功');
  }
}
