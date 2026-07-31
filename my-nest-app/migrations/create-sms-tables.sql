-- 短信验证码存储表
CREATE TABLE IF NOT EXISTS `sms_codes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `code` VARCHAR(10) NOT NULL COMMENT '验证码',
  `verified` TINYINT DEFAULT 0 COMMENT '是否已验证：0 未验证，1 已验证',
  `ip` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '客户端 IP',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_phone` (`phone`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信验证码存储表';

-- 短信发送日志表
CREATE TABLE IF NOT EXISTS `sms_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `ip` VARCHAR(50) NOT NULL COMMENT 'IP 地址',
  `status` VARCHAR(20) NOT NULL COMMENT '状态：success / failed',
  `code` VARCHAR(64) DEFAULT NULL COMMENT '验证码 SHA256 哈希（审计去重，不可逆）',
  `errorMsg` VARCHAR(255) DEFAULT NULL COMMENT '错误信息',
  `userAgent` VARCHAR(500) DEFAULT NULL COMMENT 'User-Agent',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_phone` (`phone`),
  INDEX `idx_ip` (`ip`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信发送日志表';