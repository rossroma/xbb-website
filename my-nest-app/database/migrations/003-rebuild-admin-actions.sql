-- ============================================================
-- 迁移：重建权限定义表，建立「模块 → CRUD 操作」两级权限体系
-- 日期：2026-08-05
-- 说明：
--   1. 清空 web_admin_action 表，使用标准父子关系重建
--      （parent_id 引用本表 id，parent_id=0 为根节点）
--   2. 将现有用户组的 rules 字段从旧权限码迁移到新 CRUD 权限码
--   3. rules_category 字段保持不变（栏目分类 ID 沿用）
-- ============================================================

SET NAMES utf8mb4;

-- ============================================================
-- 第一步：清空并重建权限定义表
-- ============================================================

TRUNCATE TABLE `web_admin_action`;
ALTER TABLE `web_admin_action` AUTO_INCREMENT = 1;

INSERT INTO `web_admin_action` (`id`, `parent_id`, `action_code`, `action_name`, `ord`, `status`) VALUES
-- 根节点（parent_id=0）
(1,  0, 'content_manage',  '内容管理', 1, 1),
(2,  0, 'category_manage', '栏目管理', 2, 1),
(3,  0, 'ads_manage',      '广告管理', 3, 1),
(4,  0, 'settings_manage', '系统设置', 4, 1),
(5,  0, 'system_manage',   '系统管理', 5, 1),
(6,  0, 'message_manage',  '留言管理', 6, 1),

-- 内容管理 CRUD（parent_id=1）
(11, 1, 'content_manage.view',   '查看', 1, 1),
(12, 1, 'content_manage.create', '新建', 2, 1),
(13, 1, 'content_manage.edit',   '编辑', 3, 1),
(14, 1, 'content_manage.delete', '删除', 4, 1),

-- 栏目管理 CRUD（parent_id=2）
(21, 2, 'category_manage.view',   '查看', 1, 1),
(22, 2, 'category_manage.create', '新建', 2, 1),
(23, 2, 'category_manage.edit',   '编辑', 3, 1),
(24, 2, 'category_manage.delete', '删除', 4, 1),

-- 广告管理 CRUD（parent_id=3）
(31, 3, 'ads_manage.view',   '查看', 1, 1),
(32, 3, 'ads_manage.create', '新建', 2, 1),
(33, 3, 'ads_manage.edit',   '编辑', 3, 1),
(34, 3, 'ads_manage.delete', '删除', 4, 1),

-- 系统设置（仅查看+编辑，parent_id=4）
(41, 4, 'settings_manage.view', '查看', 1, 1),
(42, 4, 'settings_manage.edit', '编辑', 2, 1),

-- 系统管理子模块（parent_id=5，二级分组节点）
(51, 5, 'admin_manage',    '管理员管理', 1, 1),
(52, 5, 'group_manage',    '用户组管理', 2, 1),
(53, 5, 'operation_logs',  '操作日志',   3, 1),
(54, 5, 'login_logs',      '登录日志',   4, 1),

-- 管理员管理 CRUD（parent_id=51）
(61, 51, 'admin_manage.view',   '查看', 1, 1),
(62, 51, 'admin_manage.create', '新建', 2, 1),
(63, 51, 'admin_manage.edit',   '编辑', 3, 1),
(64, 51, 'admin_manage.delete', '删除', 4, 1),

-- 用户组管理 CRUD（parent_id=52）
(71, 52, 'group_manage.view',   '查看', 1, 1),
(72, 52, 'group_manage.create', '新建', 2, 1),
(73, 52, 'group_manage.edit',   '编辑', 3, 1),
(74, 52, 'group_manage.delete', '删除', 4, 1),

-- 操作日志（仅查看，parent_id=53）
(81, 53, 'operation_logs.view', '查看', 1, 1),

-- 登录日志（仅查看，parent_id=54）
(91, 54, 'login_logs.view', '查看', 1, 1),

-- 留言管理 CRUD（无新建，parent_id=6）
(101, 6, 'message_manage.view',   '查看', 1, 1),
(102, 6, 'message_manage.edit',   '编辑', 2, 1),
(103, 6, 'message_manage.delete', '删除', 3, 1);

-- ============================================================
-- 第二步：迁移现有用户组 rules 字段
-- 替换顺序：先替换长字符串（避免子串匹配问题），再替换短字符串
-- 迁移策略：拥有旧模块权限 → 获得该模块全部 CRUD 操作权限
-- ============================================================

-- 辅助：将 rules 包装为 ,rules, 格式以避免子串误匹配
-- 替换完成后去除首尾逗号并清理连续逗号

UPDATE `web_admin_groups`
SET `rules` = CONCAT(',', `rules`, ',')
WHERE `rules` IS NOT NULL AND `rules` != '';

-- 按从长到短的顺序替换（避免子串匹配问题）
-- 1. 废弃项 → 移除（替换为空）
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',typeList,', ',') WHERE `rules` LIKE '%,typeList,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',message_4,', ',') WHERE `rules` LIKE '%,message_4,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',message_3,', ',') WHERE `rules` LIKE '%,message_3,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',message_2,', ',') WHERE `rules` LIKE '%,message_2,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',message_1,', ',') WHERE `rules` LIKE '%,message_1,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',templates,', ',') WHERE `rules` LIKE '%,templates,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',template,', ',') WHERE `rules` LIKE '%,template,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',logins,', ',') WHERE `rules` LIKE '%,logins,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',adsType,', ',') WHERE `rules` LIKE '%,adsType,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',baseinfo,', ',') WHERE `rules` LIKE '%,baseinfo,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',base,', ',') WHERE `rules` LIKE '%,base,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',system,', ',') WHERE `rules` LIKE '%,system,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',backup_db,', ',') WHERE `rules` LIKE '%,backup_db,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',attribute,', ',') WHERE `rules` LIKE '%,attribute,%';
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',files,', ',') WHERE `rules` LIKE '%,files,%';

-- 2. 旧权限码 → 新 CRUD 权限码
-- adstypes → ads_manage.*
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',adstypes,', ',ads_manage.view,ads_manage.create,ads_manage.edit,ads_manage.delete,') WHERE `rules` LIKE '%,adstypes,%';

-- types → category_manage.*
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',types,', ',category_manage.view,category_manage.create,category_manage.edit,category_manage.delete,') WHERE `rules` LIKE '%,types,%';

-- setting → settings_manage.*
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',setting,', ',settings_manage.view,settings_manage.edit,') WHERE `rules` LIKE '%,setting,%';

-- user → admin_manage.*
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',user,', ',admin_manage.view,admin_manage.create,admin_manage.edit,admin_manage.delete,') WHERE `rules` LIKE '%,user,%';

-- admin_groups → group_manage.*
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',admin_groups,', ',group_manage.view,group_manage.create,group_manage.edit,group_manage.delete,') WHERE `rules` LIKE '%,admin_groups,%';

-- logs → operation_logs.view
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',logs,', ',operation_logs.view,') WHERE `rules` LIKE '%,logs,%';

-- message → message_manage.*
UPDATE `web_admin_groups` SET `rules` = REPLACE(`rules`, ',message,', ',message_manage.view,message_manage.edit,message_manage.delete,') WHERE `rules` LIKE '%,message,%';

-- 3. 清理：去除首尾逗号，压缩连续逗号为单个逗号
UPDATE `web_admin_groups`
SET `rules` = REPLACE(REPLACE(REPLACE(TRIM(',' FROM `rules`), ',,', ','), ',,', ','), ',,', ',')
WHERE `rules` IS NOT NULL AND `rules` != '';

-- 4. 清理空字符串为 NULL
UPDATE `web_admin_groups`
SET `rules` = NULL
WHERE `rules` = '';