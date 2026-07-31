import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { TemplateService } from '../template.service';
import { TemplateResponseDto } from '../dto/template-response.dto';

@Controller('v1/client/templates')
@Public()
export class ClientTemplateController {
  constructor(private readonly templateService: TemplateService) { }

  // 获取当前模板
  @Get('current')
  async getCurrentTemplate(): Promise<TemplateResponseDto | null> {
    return this.templateService.getCurrentTemplate();
  }

  // 获取模板详情
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TemplateResponseDto> {
    return this.templateService.findOneForClient(id);
  }
}