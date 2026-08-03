import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LogsService } from '../logs.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResponseResult } from '../../../common/interfaces/response.interface';

@Controller('v1/admin/logs')
@UseGuards(JwtAuthGuard)
export class AdminLogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * 获取操作日志列表
   */
  @Get('operations')
  async getOperationLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('action_type') action_type?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ): Promise<ResponseResult<{ items: unknown[]; total: number }>> {
    const result = await this.logsService.getOperationLogs({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      keyword,
      action_type,
      start_date,
      end_date,
    });
    return ResponseResult.success(result, '获取操作日志列表成功');
  }

  /**
   * 获取登录日志列表
   */
  @Get('logins')
  async getLoginLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('username') username?: string,
    @Query('status') status?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ): Promise<ResponseResult<{ items: unknown[]; total: number }>> {
    const result = await this.logsService.getLoginLogs({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      username,
      status,
      start_date,
      end_date,
    });
    return ResponseResult.success(result, '获取登录日志列表成功');
  }

  /**
   * 获取日志统计
   */
  @Get('statistics')
  async getLogsStatistics(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ): Promise<ResponseResult<Record<string, number>>> {
    const result = await this.logsService.getLogsStats({
      start_date,
      end_date,
    });
    return ResponseResult.success(result, '获取日志统计成功');
  }
}