import { SetMetadata } from '@nestjs/common';

export const OPERATION_LOG_KEY = 'operation_log';

export interface OperationLogOptions {
  /** 操作模块标题 */
  title: string;
  /** 操作类型：1-新增，2-修改，3-删除 */
  type: number;
  /** 目标字段名列表（用于提取修改前后的值） */
  targetFields?: string[];
  /** 标题前缀 */
  titlePrefix?: string;
  /** 数据来源优先级（用于从不同位置提取目标字段值） */
  sourceOrder?: string[];
}

/**
 * 操作日志装饰器 — 标记需要记录操作日志的接口
 *
 * @example
 * ```typescript
 * @Post()
 * @OperationLog({ title: '文章', type: 1, targetFields: ['title'], titlePrefix: '文章：' })
 * create(@Body() dto: CreateArticleDto) { ... }
 * ```
 */
export const OperationLog = (options: OperationLogOptions) =>
  SetMetadata(OPERATION_LOG_KEY, options);