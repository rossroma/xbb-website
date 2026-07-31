import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { CategoryListResponseDto } from '../dto/category-response.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { ResponseResult } from '../../../common/interfaces/response.interface';

@Controller('v1/client/categories')
@Public()
export class ClientCategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async findAll(
    @Query('all') all?: string,
  ): Promise<ResponseResult<CategoryListResponseDto>> {
    const includeAll = all === 'true' || all === '1';
    const result = await this.categoryService.findAllForClient(includeAll);
    return ResponseResult.success(result, '获取栏目列表成功');
  }

  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string): Promise<ResponseResult<any>> {
    const result = await this.categoryService.findOneBySlugForClient(slug);
    return ResponseResult.success(result, '获取栏目详情成功');
  }
}
