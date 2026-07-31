export class MessageResponseDto {
  id: number;
  bid: number;
  title?: string;
  mname: string;
  address?: string;
  tel: string;
  email?: string;
  age?: string;
  descs?: string;
  check_status: number;
  read_status: number;
  content: string;
  addtime: number;
  source?: string;
  article_id?: number;
  article_score?: number;
  scale?: string;
  industry?: string;
  reply_content?: string;
  reply_time?: number;
  reply_admin_name?: string;

  // 格式化的时间字段
  formatted_addtime?: string;
  formatted_reply_time?: string;

  // 状态文本
  check_status_text?: string;
  read_status_text?: string;
}

export class MessageListResponseDto {
  items: MessageResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class MessageStatsDto {
  total: number;
  unread: number;
  unchecked: number;
  replied: number;
}