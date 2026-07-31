import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TemplateService } from '../template.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { QueryTemplateDto } from '../dto/query-template.dto';
import {
  TemplateResponseDto,
  TemplateListResponseDto,
  TemplatePreviewDto,
  TemplateApplyDto,
  TemplatePreviewRequestDto,
  TemplateContentDto,
  TemplateSampleDataDto,
  TemplatePublishDto,
} from '../dto/template-response.dto';

@Controller('v1/admin/templates')
@UseGuards(JwtAuthGuard)
export class AdminTemplateController {
  constructor(private readonly templateService: TemplateService) { }

  // 创建模板
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto): Promise<TemplateResponseDto> {
    return this.templateService.create(createTemplateDto);
  }

  // 获取模板列表
  @Get()
  async findAll(@Query() query: QueryTemplateDto): Promise<TemplateListResponseDto> {
    return this.templateService.findAll(query);
  }

  // 获取模板详情
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TemplateResponseDto> {
    return this.templateService.findOne(id);
  }

  // 更新模板
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<TemplateResponseDto> {
    return this.templateService.update(id, updateTemplateDto);
  }

  // 删除模板
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.templateService.remove(id);
  }

  // 获取模板源码
  @Get(':id/content')
  async getContent(@Param('id', ParseIntPipe) id: number): Promise<TemplateContentDto> {
    return this.templateService.getContent(id);
  }

  // 保存模板源码
  @Put(':id/content')
  async saveContent(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ): Promise<TemplateContentDto> {
    return this.templateService.saveContent(id, content);
  }

  @Get(':id/sample-data')
  async getSampleData(
    @Param('id', ParseIntPipe) id: number,
    @Query('mode') mode?: string,
    @Query('categoryEnglish') categoryEnglish?: string,
    @Query('categoryId') categoryId?: string,
    @Query('articleId') articleId?: string,
  ): Promise<TemplateSampleDataDto> {
    return this.templateService.getSampleData(id, {
      mode,
      categoryEnglish,
      categoryId: categoryId ? Number(categoryId) : undefined,
      articleId: articleId ? Number(articleId) : undefined,
    });
  }

  // 预览模板
  @Post(':id/preview')
  async preview(
    @Param('id', ParseIntPipe) id: number,
    @Body() previewRequest: TemplatePreviewRequestDto,
  ): Promise<TemplatePreviewDto> {
    return this.templateService.preview(id, previewRequest);
  }

  // 应用模板
  @Post(':id/apply')
  async apply(@Param('id', ParseIntPipe) id: number): Promise<TemplateApplyDto> {
    return this.templateService.apply(id);
  }

  // 发布模板
  @Post(':id/publish')
  async publish(@Param('id', ParseIntPipe) id: number): Promise<TemplatePublishDto> {
    return this.templateService.publish(id);
  }
}
