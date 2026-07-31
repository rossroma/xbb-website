import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MessageService } from '../message.service';
import { SmsService } from '../../sms/sms.service';
import { DataCenterPushService } from '../services/data-center-push.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateTrialMessageDto } from '../dto/create-trial-message.dto';
import { Public } from '../../auth/decorators/public.decorator';

/**
 * 客户端留言控制器
 *
 * 两个端点：
 * - POST /v1/client/messages — 通用留言提交（仅存本地数据库）
 * - POST /v1/client/trials  — 免费试用注册（先推数据中心，失败存本地兜底）
 */
@Controller('v1/client')
@Public()
export class ClientMessageController {
  private readonly logger = new Logger(ClientMessageController.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly smsService: SmsService,
    private readonly dataCenterPushService: DataCenterPushService,
  ) { }

  // ==================== 通用留言提交 ====================

  /**
   * 提交留言
   * POST /v1/client/messages
   *
   * 频率限制：60 秒内最多 3 次提交
   */
  @Post('messages')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    return message;
  }

  /**
   * 查看留言状态
   */
  @Get('messages/:id')
  async findOne(@Param('id') id: string) {
    return await this.messageService.findByIdForClient(+id);
  }

  // ==================== 免费试用注册 ====================

  /**
   * 免费试用注册（增强版 — 含短信验证 + 数据中心推送）
   * POST /v1/client/trials
   *
   * 流程（对应旧版 PHP 的 ajaxRegSave）：
   * 1. 校验短信验证码
   * 2. 推送数据中心（主路径）
   * 3. 推送失败 → 存本地 web_message 表（兜底）
   *
   * 频率限制：60 秒内最多 3 次提交
   */
  @Post('trials')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  async createTrial(@Body() dto: CreateTrialMessageDto) {
    // 1. 短信验证码校验
    if (!dto.tel) {
      throw new BadRequestException('手机号不能为空');
    }

    const verified = await this.smsService.isPhoneVerified(dto.tel);
    if (!verified) {
      throw new BadRequestException('请先验证手机号');
    }

    // 2. 推送数据中心（主路径）
    const pushResult = await this.dataCenterPushService.pushTrialRegistration(dto);

    if (pushResult.success) {
      return { status: 200, msg: '提交成功' };
    }

    // 3. 推送失败 → 写入本地数据库兜底
    this.logger.warn(`数据中心推送失败，写入本地兜底: tel=${dto.tel}, error=${pushResult.error}`);

    try {
      await this.messageService.create({
        bid: 4,
        title: dto.title,
        mname: dto.mname || '官网试用',
        tel: dto.tel,
        scale: dto.scale,
        industry: dto.industry,
        email: dto.email,
        descs: dto.descs,
        content: `免费试用申请：${dto.title}`,
        source: dto.channel || '官网',
      });
    } catch (dbError) {
      this.logger.error(`兜底写入数据库也失败: tel=${dto.tel}, error=${dbError}`);
    }

    return { status: 200, msg: '提交成功' };
  }
}