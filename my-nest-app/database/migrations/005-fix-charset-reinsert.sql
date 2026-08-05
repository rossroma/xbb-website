-- ============================================================
-- 重新插入 web_admin_action 数据（修复中文乱码）
-- 日期：2026-08-05
-- 说明：前次执行未设置 UTF-8 编码导致中文变乱码，重新插入
-- ============================================================

SET NAMES utf8mb4;

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