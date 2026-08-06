import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SmsService } from '../sms.service';
import { QuerySmsLogDto } from '../dto/query-sms-log.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';

/**
 * 短信服务管理端控制器
 * 路由前缀: /v1/admin/sms
 */
@Controller('v1/admin/sms')
@UseGuards(JwtAuthGuard)
export class AdminSmsController {
  constructor(private readonly smsService: SmsService) {}

  /**
   * 获取短信发送日志列表
   * GET /v1/admin/sms/logs
   *
   * 支持按手机号、发送状态、日期范围筛选，分页返回
   */
  @Get('logs')
  @RequirePermissions('sms_manage.view')
  async findLogs(@Query() query: QuerySmsLogDto) {
    return await this.smsService.findLogs(query);
  }
}