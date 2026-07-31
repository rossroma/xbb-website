import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto, CategoryListResponseDto } from '../dto/category-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResponseResult } from '../../../common/interfaces/response.interface';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin/categories')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @OperationLog({ title: '栏目', type: 1, targetFields: ['title'], titlePrefix: '栏目：' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseResult<CategoryResponseDto>> {
    const result = await this.categoryService.create(createCategoryDto);
    return ResponseResult.success(result, '栏目创建成功');
  }

  @Get()
  async findAll(
    @Query('keyword') keyword?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
  ): Promise<ResponseResult<CategoryListResponseDto>> {
    const result = await this.categoryService.findAll(
      keyword,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      sortBy || 'ord_asc',
    );
    return ResponseResult.success(result, '获取栏目列表成功');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<CategoryResponseDto>> {
    const result = await this.categoryService.findOne(id);
    return ResponseResult.success(result, '获取栏目详情成功');
  }

  @Put(':id')
  @OperationLog({ title: '栏目', type: 2, targetFields: ['title'], titlePrefix: '栏目：' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseResult<CategoryResponseDto>> {
    const result = await this.categoryService.update(id, updateCategoryDto);
    return ResponseResult.success(result, '栏目更新成功');
  }

  @Delete(':id')
  @OperationLog({ title: '栏目', type: 3, targetFields: ['title'], titlePrefix: '栏目：' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseResult<CategoryResponseDto>> {
    const target = await this.categoryService.findOne(id);
    await this.categoryService.remove(id);
    return ResponseResult.success(target, '栏目删除成功');
  }
}
