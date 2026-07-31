import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { ResponseResult } from '../../../common/interfaces/response.interface';
import { TemplateService } from '../template.service';
import { ClientPageRenderResponseDto } from '../dto/template-response.dto';

@Controller('v1/client/pages')
@Public()
export class ClientPageController {
  constructor(private readonly templateService: TemplateService) { }

  @Get('render')
  async render(
    @Query('english') english?: string,
    @Query('id') id?: string,
    @Query('page') page?: string,
  ): Promise<ResponseResult<ClientPageRenderResponseDto>> {
    const numericId = id ? Number(id) : undefined;
    const numericPage = page ? Number(page) : 1;
    const result = await this.templateService.renderClientPage(
      english || '',
      Number.isFinite(numericId) ? numericId : undefined,
      Number.isFinite(numericPage) && numericPage > 0 ? numericPage : 1,
    );
    return ResponseResult.success(result, '渲染数据获取成功');
  }
}
