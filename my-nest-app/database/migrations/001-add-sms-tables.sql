-- 迁移脚本：新增短信验证码与日志表
-- 执行时间：部署前手动执行
-- 说明：替代旧版 PHP Session 存储方式，用于无状态 NestJS 服务

-- 短信验证码存储表
CREATE TABLE IF NOT EXISTS `sms_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `code` varchar(60) NOT NULL COMMENT '验证码（bcrypt 哈希）',
  `verified` tinyint NOT NULL DEFAULT '0' COMMENT '是否已验证：0 未验证，1 已验证',
  `ip` varchar(50) NOT NULL COMMENT '客户端 IP',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短信验证码存储表';

-- 短信发送日志表
CREATE TABLE IF NOT EXISTS `sms_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `ip` varchar(50) NOT NULL COMMENT 'IP 地址',
  `status` varchar(20) NOT NULL COMMENT '状态：success / failed',
  `code` varchar(64) DEFAULT NULL COMMENT '验证码 SHA256 哈希（审计去重，不可逆）',
  `errorMsg` varchar(255) DEFAULT NULL COMMENT '错误信息',
  `userAgent` varchar(500) DEFAULT NULL COMMENT '客户端 User-Agent（用于安全审计）',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_ip` (`ip`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短信发送日志表';