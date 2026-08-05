-- 迁移脚本：数据中心推送日志表
-- 执行时间：部署前手动执行
-- 说明：记录每次免费试用推送的完整信息，用于失败重试、审计追溯、数据对账

CREATE TABLE IF NOT EXISTS `data_center_push_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int DEFAULT NULL COMMENT '关联的留言ID',
  `pushType` varchar(20) NOT NULL COMMENT '推送类型',
  `payload` json NOT NULL COMMENT '推送的完整 payload',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '推送状态：0 失败待重试，1 成功',
  `errorMsg` text DEFAULT NULL COMMENT '错误信息',
  `retryCount` int NOT NULL DEFAULT '0' COMMENT '重试次数',
  `nextRetryAt` int DEFAULT NULL COMMENT '下次重试时间戳',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='数据中心推送日志表';