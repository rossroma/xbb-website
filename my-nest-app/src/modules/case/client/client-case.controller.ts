import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CaseService } from '../case.service';
import { CaseDetailWithNavDto, CaseListResponseDto } from '../dto/case-response.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { ResponseResult } from '../../../common/interfaces/response.interface';

@Controller('v1/client/cases')
@Public()
export class ClientCaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('bid') bid?: string,
    @Query('tag') tag?: string,
    @Query('rootBid') rootBid?: string,
    @Query('order') order?: string,
  ): Promise<ResponseResult<CaseListResponseDto>> {
    const result = await this.caseService.findAllForClient(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      bid ? parseInt(bid, 10) : undefined,
      tag,
      rootBid ? parseInt(rootBid, 10) : undefined,
      order,
    );
    return ResponseResult.success(result, '获取案例列表成功');
  }

  @Get(':id/detail')
  async findOneDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseResult<CaseDetailWithNavDto>> {
    const result = await this.caseService.findOneForClientWithNavigation(id);
    return ResponseResult.success(result, '获取案例详情成功');
  }
}