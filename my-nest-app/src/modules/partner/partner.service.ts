import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { partnerApiConfig } from './config/partner.config';
import type { PartnerInfo, PartnerQueryResponse } from './dto/partner-response.dto';

/**
 * 三方 API 原始响应结构
 */
interface ThirdPartyApiItem {
  data: {
    addTime?: number;
    text_1?: string;    // 伙伴名称
    updateTime?: number;
    date_2?: number;     // 合作结束日期（Unix 时间戳，秒）
    date_1?: number;     // 合作开始日期（Unix 时间戳，秒）
    text_3?: string;     // 联系人
    text_5?: {
      checked?: boolean;
      color?: string;
      isOther?: number;
      isVisible?: number;
      text?: string;     // 状态文本
      value?: string;
    };
  };
}

interface ThirdPartyApiResponse {
  code: number;
  empty: boolean;
  msg: string;
  success: boolean;
  totalCount: number;
  result: {
    paasFormDataESList: ThirdPartyApiItem[];
  };
}

/**
 * 合作伙伴查询服务
 *
 * 职责：
 * 1. 接收前端关键词，拼装三方 API 请求体
 * 2. 调用钉钉云外部链接 API
 * 3. 清洗三方 API 原始字段，转换为前端友好的数据结构
 */
@Injectable()
export class PartnerService {
  private readonly logger = new Logger(PartnerService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * 查询合作伙伴信息
   *
   * @param keyword - 企业名称或合作伙伴编号
   * @returns 清洗后的合作伙伴列表
   */
  async queryPartners(keyword: string): Promise<PartnerQueryResponse> {
    const requestBody = this.buildRequestBody(keyword);

    this.logger.log(`查询合作伙伴，关键词: "${keyword}"`);

    let response: ThirdPartyApiResponse;

    try {
      const httpResponse = await firstValueFrom(
        this.httpService.post<ThirdPartyApiResponse>(partnerApiConfig.apiUrl, requestBody, {
          timeout: partnerApiConfig.timeout,
          proxy: false, // 绕过系统代理，直连三方 API
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      response = httpResponse.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.msg || error?.message || '未知错误';

      this.logger.error(
        `调用三方 API 失败: ${status ? `HTTP ${status}` : '网络错误'} — ${msg}`,
        error?.stack,
      );

      throw new ServiceUnavailableException(
        status === 401 || status === 403
          ? '合作伙伴查询服务认证失败，请联系管理员'
          : '合作伙伴查询服务暂时不可用，请稍后重试',
      );
    }

    // 校验三方 API 返回
    if (!response?.success) {
      this.logger.warn(`三方 API 返回失败: code=${response?.code}, msg=${response?.msg}`);
      throw new ServiceUnavailableException(response?.msg || '查询失败，请稍后重试');
    }

    // 清洗数据
    const list = this.transformResponse(response);
    const total = response.totalCount ?? list.length;

    return { list, total };
  }

  /**
   * 构建三方 API 请求体
   *
   * 将前端传入的 keyword 包装为三方 API 所需的 conditions 查询结构
   */
  private buildRequestBody(keyword: string) {
    return {
      corpid: partnerApiConfig.corpid,
      userId: partnerApiConfig.userId,
      platform: partnerApiConfig.platform,
      token: partnerApiConfig.token,
      conditions: [
        {
          attr: partnerApiConfig.searchField,
          fieldType: partnerApiConfig.fieldType,
          symbol: partnerApiConfig.matchSymbol,
          value: [keyword],
        },
      ],
    };
  }

  /**
   * 清洗三方 API 原始数据 → 前端友好的 PartnerInfo 列表
   *
   * 字段映射（依据三方 API explainMap 中的 attrName）：
   *   text_1      → name      伙伴名称
   *   date_2      → startDate 合作开始日期（Unix 时间戳 → YYYY-MM-DD）
   *   date_1      → endDate   合作结束日期（Unix 时间戳 → YYYY-MM-DD）
   *   text_5.text → status    状态文本
   */
  private transformResponse(response: ThirdPartyApiResponse): PartnerInfo[] {
    const items = response?.result?.paasFormDataESList ?? [];

    return items
      .map((item) => {
        const data = item.data;
        if (!data) return null;

        return {
          name: data.text_1?.trim() || '',
          startDate: this.formatTimestamp(data.date_2),
          endDate: this.formatTimestamp(data.date_1),
          status: data.text_5?.text || '',
        };
      })
      .filter((item): item is PartnerInfo => item !== null);
  }

  /**
   * Unix 时间戳（秒）→ YYYY-MM-DD 格式
   *
   * @param timestamp - Unix 时间戳（秒），为 0 / undefined / null 时返回 '-'
   */
  private formatTimestamp(timestamp?: number): string {
    if (!timestamp) return '-';

    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}