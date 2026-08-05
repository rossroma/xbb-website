-- ============================================================
-- 修复迁移：补全遗漏的权限映射
-- 日期：2026-08-05
-- 说明：
--   1. logins 被错误标记为废弃项，应映射为 login_logs.view
--   2. 系统管理员组应拥有 content_manage.* 全部权限
-- ============================================================

SET NAMES utf8mb4;

-- 为系统管理员组（id=1,2）补上 content_manage.* 和 login_logs.view
UPDATE `web_admin_groups`
SET `rules` = CONCAT(
  `rules`,
  ',content_manage.view,content_manage.create,content_manage.edit,content_manage.delete,login_logs.view'
)
WHERE `id` IN (1, 2)
  AND `rules` IS NOT NULL
  AND `rules` != ''
  AND `rules` NOT LIKE '%content_manage%';

-- 清理可能产生的连续逗号
UPDATE `web_admin_groups`
SET `rules` = REPLACE(REPLACE(REPLACE(`rules`, ',,', ','), ',,', ','), ',,', ',')
WHERE `rules` IS NOT NULL AND `rules` != '';