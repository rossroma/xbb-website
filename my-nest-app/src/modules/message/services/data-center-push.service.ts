import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { createHash } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { DataCenterPushLog } from '../entities/data-center-push-log.entity';
import { dataCenterConfig } from '../../sms/config/sms.config';

/**
 * 数据中心线索推送服务
 *
 * 职责：
 * 1. 构建钉钉宜搭表单数据包（对应旧版 ajaxRegSave 的字段映射）
 * 2. 签名（SHA256）并调用数据中心回调接口
 * 3. 记录推送日志到 data_center_push_logs 表
 * 4. 支持重试（最多 3 次，指数退避）
 */
@Injectable()
export class DataCenterPushService {
  private readonly logger = new Logger(DataCenterPushService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    @InjectRepository(DataCenterPushLog)
    private readonly pushLogRepository: Repository<DataCenterPushLog>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 推送免费试用线索到数据中心
   *
   * 对应旧版 PHP 的 Message.php ajaxRegSave() 中的 getHttp() 调用。
   * 字段映射与旧版完全一致。
   *
   * @param payload 试用注册数据（含 SEM 推广参数）
   * @returns 推送结果
   */
  async pushTrialRegistration(payload: {
    title: string;
    tel: string;
    mname?: string;
    scale?: string;
    industry?: string;
    email?: string;
    descs?: string;
    plan?: string;
    unit?: string;
    keyword?: string;
    channel?: string;
    bdVid?: string;
    bd?: string;
    extends?: string;
  }): Promise<{ success: boolean; result?: any; error?: string }> {
    const body = {
      corpid: dataCenterConfig.corpid,
      userId: dataCenterConfig.userId,
      formId: dataCenterConfig.formId,
      bd_vid: payload.bdVid || '',
      bd: payload.bd || '',
      dataList: {
        extends: payload.extends || '',
        text_1: payload.title || '',                          // 企业名称
        subForm_1: payload.tel || '',                         // 手机号
        text_12: payload.scale || '',                         // 企业规模
        text_62: payload.industry || '',                      // 所属行业
        text_2: payload.mname || '官网试用',                   // 姓名/来源名称
        text_65: payload.plan || '',                          // 投放计划
        text_61: payload.unit || '',                          // 投放单元
        text_53: payload.keyword || '',                       // 广告关键词
        text_4: payload.channel || '官网',                     // 线索来源
        text_9: (payload.email || '') + (payload.descs || ''), // 备注
      },
    };

    return await this.push(body, 0);
  }

  /**
   * 底层 HTTP 推送（含签名 + 重试）
   *
   * @param body 数据中心请求体
   * @param retryCount 当前重试次数
   */
  private async push(
    body: Record<string, any>,
    retryCount: number,
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    const bodyStr = JSON.stringify(body);

    // 签名算法：SHA256(body + token)，与 PHP hash("sha256", $str) 一致
    const sign = createHash('sha256')
      .update(bodyStr + dataCenterConfig.token)
      .digest('hex');

    // 记录推送日志
    const pushLog = this.pushLogRepository.create({
      pushType: 'trial',
      payload: body,
      status: 0,
      retryCount,
      nextRetryAt: this.calculateNextRetry(retryCount),
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(dataCenterConfig.url, bodyStr, {
          timeout: 10000,
          proxy: false, // 绕过系统代理，直连数据中心 API
          headers: {
            'Content-Type': 'application/json',
            sign,
          },
        }),
      );

      // 推送成功
      pushLog.status = 1;
      await this.pushLogRepository.save(pushLog);

      this.logger.log(`数据中心推送成功: pushLogId=${pushLog.id}, tel=${body?.dataList?.subForm_1}`);
      return { success: true, result: response.data };
    } catch (error) {
      const errMsg = error?.response?.data?.msg || error?.message || '网络错误';

      pushLog.errorMsg = errMsg;
      await this.pushLogRepository.save(pushLog);

      // 如果还有重试机会，尝试重试
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(`数据中心推送失败，将重试 (${retryCount + 1}/${this.MAX_RETRIES}): pushLogId=${pushLog.id}, error=${errMsg}`);
        // 等待后重试
        await this.delay(retryCount);
        return await this.push(body, retryCount + 1);
      }

      this.logger.warn(`数据中心推送失败（已达最大重试次数）: pushLogId=${pushLog.id}, error=${errMsg}`);
      return { success: false, error: errMsg };
    }
  }

  /**
   * 计算下次重试时间戳（指数退避）
   * retryCount 0 → 1s, 1 → 2s, 2 → 4s
   */
  private calculateNextRetry(retryCount: number): number {
    const delayMs = Math.pow(2, retryCount) * 1000;
    return Math.floor((Date.now() + delayMs) / 1000);
  }

  /**
   * 延迟（用于重试之间等待）
   */
  private delay(retryCount: number): Promise<void> {
    const ms = Math.pow(2, retryCount) * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}