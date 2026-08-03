-- 为 web_logins 表添加 user_agent 字段，用于记录浏览器/设备信息
ALTER TABLE `web_logins` ADD COLUMN `user_agent` VARCHAR(500) NULL DEFAULT '' COMMENT '浏览器 User-Agent' AFTER `login_ip`;