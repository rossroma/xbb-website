import { Controller, Post, Body } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { QueryPartnerDto } from './dto/query-partner.dto';
import type { PartnerQueryResponse } from './dto/partner-response.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseResult } from '../../common/interfaces/response.interface';

/**
 * 合作伙伴查询客户端控制器
 * 路由前缀: /v1/client/partner
 */
@Controller('v1/client/partner')
@Public()
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  /**
   * 查询合作伙伴信息
   * POST /v1/client/partner/query
   *
   * 入参：{ keyword: string } — 企业名称或合作伙伴编号
   * 出参：{ list: PartnerInfo[], total: number }
   */
  @Post('query')
  async query(@Body() dto: QueryPartnerDto): Promise<ResponseResult<PartnerQueryResponse>> {
    const result = await this.partnerService.queryPartners(dto.keyword);
    return ResponseResult.success(result, '查询成功');
  }
}