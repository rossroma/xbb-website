import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from '../message.service';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { QueryMessageDto } from '../dto/query-message.dto';
import { ReplyMessageDto } from '../dto/reply-message.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { OperationLog } from '../../logs/decorators/operation-log.decorator';
import { OperationLogInterceptor } from '../../logs/interceptors/operation-log.interceptor';

@Controller('v1/admin/messages')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OperationLogInterceptor)
export class AdminMessageController {
  constructor(private readonly messageService: MessageService) { }

  // 获取留言列表
  @Get()
  async findAll(@Query() query: QueryMessageDto) {
    return await this.messageService.findAll(query);
  }

  // 批量更新状态（必须在 :id 路由之前）
  @Patch('batch/status')
  async batchUpdateStatus(
    @Body() body: { ids: number[]; status: { read_status?: number; check_status?: number } },
  ) {
    await this.messageService.batchUpdateStatus(body.ids, body.status);
    return { message: '批量更新成功' };
  }

  // 获取留言统计（必须在 :id 路由之前）
  @Get('stats/overview')
  async getStats() {
    return await this.messageService.getStats();
  }

  // 获取留言详情
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.messageService.findOne(+id);
  }

  // 更新留言状态
  @Patch(':id')
  @OperationLog({ title: '留言', type: 2, targetFields: ['title', 'id'], titlePrefix: '留言：', sourceOrder: ['response', 'body', 'params'] })
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return await this.messageService.update(+id, updateMessageDto);
  }

  // 回复留言
  @Post(':id/reply')
  async reply(
    @Param('id') id: string,
    @Body() replyDto: ReplyMessageDto,
    @CurrentUser() user: any,
  ) {
    return await this.messageService.reply(+id, replyDto, user.id, user.username);
  }

  // 删除留言
  @Delete(':id')
  @OperationLog({ title: '留言', type: 3, targetFields: ['id'], sourceOrder: ['params'], titlePrefix: '留言#' })
  async remove(@Param('id') id: string) {
    await this.messageService.remove(+id);
    return { message: '删除成功' };
  }
}
