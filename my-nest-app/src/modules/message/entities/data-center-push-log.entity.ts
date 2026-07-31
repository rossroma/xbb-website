import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 数据中心推送日志实体
 *
 * 记录每次推送的完整信息，用于：
 * - 失败重试（定时任务扫描 status=0 的记录）
 * - 审计追溯（谁在什么时候推了什么数据）
 * - 数据对账（与数据中心侧核对）
 */
@Entity('data_center_push_logs')
export class DataCenterPushLog {
  @PrimaryGeneratedColumn()
  id: number;

  /** 关联的留言 ID（本地兜底记录） */
  @Column({ type: 'int', nullable: true, comment: '关联的留言ID' })
  messageId: number;

  /** 推送类型：trial（免费试用） */
  @Column({ length: 20, comment: '推送类型' })
  pushType: string;

  /** 推送的完整 payload（JSON） */
  @Column({ type: 'json', comment: '推送的完整 payload' })
  payload: any;

  /** 推送状态：0 待推送/失败，1 成功 */
  @Column({ type: 'tinyint', default: 0, comment: '推送状态：0 失败待重试，1 成功' })
  status: number;

  /** 错误信息 */
  @Column({ type: 'text', nullable: true, comment: '错误信息' })
  errorMsg: string;

  /** 重试次数 */
  @Column({ type: 'int', default: 0, comment: '重试次数' })
  retryCount: number;

  /** 下次重试时间戳（秒） */
  @Column({ type: 'int', nullable: true, comment: '下次重试时间戳' })
  nextRetryAt: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updated_at: Date;
}