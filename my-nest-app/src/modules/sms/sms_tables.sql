-- ============================================================
-- 短信模块数据库表迁移
-- 对应 NestJS 实体: SmsCode, SmsLog
-- ============================================================

-- 短信验证码存储表（替代旧版 PHP Session）
CREATE TABLE IF NOT EXISTS `sms_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `code` varchar(10) NOT NULL COMMENT '验证码',
  `verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已验证：0 未验证，1 已验证',
  `ip` varchar(50) NOT NULL DEFAULT '' COMMENT '客户端 IP',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信验证码存储表';

-- 短信发送日志表（与旧版 sms_logs 表结构兼容）
CREATE TABLE IF NOT EXISTS `sms_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `ip` varchar(50) NOT NULL COMMENT 'IP地址',
  `status` varchar(20) NOT NULL COMMENT '状态:success,failed',
  `code` varchar(64) DEFAULT NULL COMMENT '验证码 SHA256 哈希（审计去重，不可逆）',
  `errorMsg` varchar(255) DEFAULT NULL COMMENT '错误信息',
  `userAgent` varchar(500) DEFAULT NULL COMMENT 'User Agent',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_ip` (`ip`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信发送日志表';