import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { createHash } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataCenterPushLog } from '../entities/data-center-push-log.entity';
import { dataCenterConfig } from '../../sms/config/sms.config';

/**
 * 数据中心推送重试服务
 *
 * 每 5 分钟扫描一次 data_center_push_logs 表，
 * 对 status=0 且 nextRetryAt <= now 的记录进行重试。
 * 最多重试 3 次。
 */
@Injectable()
export class DataCenterRetryService {
  private readonly logger = new Logger(DataCenterRetryService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    @InjectRepository(DataCenterPushLog)
    private readonly pushLogRepository: Repository<DataCenterPushLog>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 定时任务：每 5 分钟重试失败的推送
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async retryFailedPushes(): Promise<void> {
    const nowTimestamp = Math.floor(Date.now() / 1000);

    // 查找需要重试的记录：失败 且 重试次数未达上限 且 已到重试时间
    const pendingLogs = await this.pushLogRepository.find({
      where: {
        status: 0,
        // TypeORM LessThan 用于 Date 类型，我们用原生查询
      },
      order: { id: 'ASC' },
    });

    // 过滤出真正需要重试的记录
    const toRetry = pendingLogs.filter(
      log => log.retryCount < this.MAX_RETRIES && log.nextRetryAt && log.nextRetryAt <= nowTimestamp,
    );

    if (toRetry.length === 0) return;

    this.logger.log(`发现 ${toRetry.length} 条待重试的推送记录`);

    for (const log of toRetry) {
      await this.retrySingle(log);
    }
  }

  /**
   * 重试单条推送
   */
  private async retrySingle(log: DataCenterPushLog): Promise<void> {
    const bodyStr = JSON.stringify(log.payload);

    const sign = createHash('sha256')
      .update(bodyStr + dataCenterConfig.token)
      .digest('hex');

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

      // 重试成功
      log.status = 1;
      log.retryCount += 1;
      await this.pushLogRepository.save(log);

      this.logger.log(`重试推送成功: pushLogId=${log.id}, retryCount=${log.retryCount}`);
    } catch (error) {
      const errMsg = error?.response?.data?.msg || error?.message || '网络错误';

      log.errorMsg = errMsg;
      log.retryCount += 1;
      log.nextRetryAt = this.calculateNextRetry(log.retryCount);
      await this.pushLogRepository.save(log);

      if (log.retryCount >= this.MAX_RETRIES) {
        this.logger.warn(`重试推送已达最大次数: pushLogId=${log.id}, retryCount=${log.retryCount}`);
      } else {
        this.logger.warn(`重试推送失败，将在 ${log.nextRetryAt} 再次重试: pushLogId=${log.id}`);
      }
    }
  }

  /**
   * 计算下次重试时间戳（指数退避）
   */
  private calculateNextRetry(retryCount: number): number {
    const delayMs = Math.pow(2, retryCount) * 1000;
    return Math.floor((Date.now() + delayMs) / 1000);
  }
}