import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { QueryMessageDto } from './dto/query-message.dto';
import { MessageResponseDto, MessageListResponseDto, MessageStatsDto } from './dto/message-response.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) { }

  // 创建留言（客户端）
  async create(createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    const message = this.messageRepository.create({
      ...createMessageDto,
      addtime: Math.floor(Date.now() / 1000),
      read_status: 0,
      check_status: 0,
    });

    const saved = await this.messageRepository.save(message);
    return this.formatMessageResponse(saved);
  }

  // 获取留言列表（管理端）
  async findAll(query: QueryMessageDto): Promise<MessageListResponseDto> {
    const { page = 1, limit = 10, keyword, read_status, check_status, bid, start_date, end_date, sortBy = 'id_desc' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.messageRepository.createQueryBuilder('message');

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(message.mname LIKE :keyword OR message.content LIKE :keyword OR message.tel LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    // 状态筛选
    if (read_status !== undefined) {
      queryBuilder.andWhere('message.read_status = :read_status', { read_status });
    }

    if (check_status !== undefined) {
      queryBuilder.andWhere('message.check_status = :check_status', { check_status });
    }

    if (bid !== undefined) {
      queryBuilder.andWhere('message.bid = :bid', { bid });
    }

    // 日期范围筛选
    if (start_date && end_date) {
      const startTimestamp = Math.floor(new Date(start_date).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(end_date).getTime() / 1000);
      queryBuilder.andWhere('message.addtime BETWEEN :start AND :end', {
        start: startTimestamp,
        end: endTimestamp,
      });
    }

    const orderMap: Record<string, [string, 'ASC' | 'DESC']> = {
      id_desc: ['message.id', 'DESC'],
      id_asc: ['message.id', 'ASC'],
      addtime_desc: ['message.addtime', 'DESC'],
      addtime_asc: ['message.addtime', 'ASC'],
    };
    const [orderField, orderDir] = orderMap[sortBy] ?? ['message.addtime', 'DESC'];

    queryBuilder
      .orderBy(orderField, orderDir)
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items: items.map(item => this.formatMessageResponse(item)),
      total,
      page,
      limit,
    };
  }

  // 获取留言详情
  async findOne(id: number): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`留言 #${id} 不存在`);
    }

    // 标记为已读
    if (message.read_status === 0) {
      await this.messageRepository.update(id, { read_status: 1 });
      message.read_status = 1;
    }

    return this.formatMessageResponse(message);
  }

  // 更新留言状态
  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`留言 #${id} 不存在`);
    }

    await this.messageRepository.update(id, updateMessageDto);
    const updated = await this.messageRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`更新后的留言 #${id} 不存在`);
    }
    return this.formatMessageResponse(updated);
  }

  // 删除留言
  async remove(id: number): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`留言 #${id} 不存在`);
    }

    await this.messageRepository.remove(message);
  }

  // 批量更新状态
  async batchUpdateStatus(ids: number[], status: { read_status?: number; check_status?: number }): Promise<void> {
    await this.messageRepository.update(ids, status);
  }

  // 获取留言统计
  async getStats(): Promise<MessageStatsDto> {
    const total = await this.messageRepository.count();
    const unread = await this.messageRepository.count({ where: { read_status: 0 } });
    const unchecked = await this.messageRepository.count({ where: { check_status: 0 } });
    const replied = 0; // 由于数据库没有回复字段，暂时设为0

    return { total, unread, unchecked, replied };
  }

  // 客户端查看留言状态
  async findByIdForClient(id: number): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`留言 #${id} 不存在`);
    }

    // 客户端只返回基本信息，不包含敏感数据
    return {
      id: message.id,
      mname: message.mname,
      content: message.content,
      addtime: message.addtime,
      check_status: message.check_status,
      formatted_addtime: this.formatTimestamp(message.addtime),
      check_status_text: this.getCheckStatusText(message.check_status),
    } as MessageResponseDto;
  }

  // 格式化响应数据
  private formatMessageResponse(message: Message): MessageResponseDto {
    return {
      id: message.id,
      bid: message.bid,
      title: message.title,
      mname: message.mname,
      address: message.address,
      tel: message.tel,
      email: message.email,
      age: message.age,
      descs: message.descs,
      check_status: message.check_status,
      read_status: message.read_status,
      content: message.content,
      addtime: message.addtime,
      source: message.source,
      article_id: message.article_id,
      article_score: message.article_score,
      scale: message.scale,
      industry: message.industry,
      formatted_addtime: this.formatTimestamp(message.addtime),
      check_status_text: this.getCheckStatusText(message.check_status),
      read_status_text: this.getReadStatusText(message.read_status),
    };
  }

  // 格式化时间戳
  private formatTimestamp(timestamp: number): string {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  }

  // 获取审核状态文本
  private getCheckStatusText(status: number): string {
    const statusMap = {
      0: '未审核',
      1: '已审核',
      2: '已拒绝',
    };
    return statusMap[status] || '未知';
  }

  // 获取读取状态文本
  private getReadStatusText(status: number): string {
    const statusMap = {
      0: '未读',
      1: '已读',
    };
    return statusMap[status] || '未知';
  }

  }

  