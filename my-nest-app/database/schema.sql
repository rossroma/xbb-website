-- MySQL dump 10.13  Distrib 8.0.43, for macos14.7 (arm64)
--
-- Host: 127.0.0.1    Database: jfyzcms_db01
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `web_admin`
--

DROP TABLE IF EXISTS `web_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_admin` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL COMMENT '用户名',
  `userpwd` varchar(60) DEFAULT NULL COMMENT '密码',
  `salt` char(6) DEFAULT '' COMMENT '验证码',
  `status` smallint DEFAULT '0' COMMENT '状态',
  `type` smallint DEFAULT '0' COMMENT '类型:0普通用户1管理员',
  `group_id` tinyint DEFAULT NULL COMMENT '用户组ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_admin_action`
--

DROP TABLE IF EXISTS `web_admin_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_admin_action` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` tinyint unsigned DEFAULT '0' COMMENT '父级ID',
  `action_code` varchar(60) DEFAULT '' COMMENT '权限名',
  `action_name` varchar(60) DEFAULT '' COMMENT '权限名称',
  `ord` smallint DEFAULT '10' COMMENT '排序',
  `url` varchar(60) DEFAULT NULL COMMENT '访问地址',
  `status` tinyint DEFAULT '1' COMMENT '权限状态',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_admin_groups`
--

DROP TABLE IF EXISTS `web_admin_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_admin_groups` (
  `id` mediumint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` char(100) DEFAULT '' COMMENT '用户组中文名称',
  `rules` text COMMENT '用户组拥有的规则id',
  `rules_category` text COMMENT '栏目权限管理',
  `status` tinyint DEFAULT '1' COMMENT '状态:1:显示0:不显示',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户组表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_ads`
--

DROP TABLE IF EXISTS `web_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_ads` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT '' COMMENT '名称',
  `subtitle` varchar(100) DEFAULT NULL COMMENT '副标题',
  `descs` varchar(500) DEFAULT '' COMMENT '描述',
  `bid` smallint DEFAULT '0' COMMENT '上级ID',
  `url` varchar(100) DEFAULT '' COMMENT '外链地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `simg` varchar(200) DEFAULT '' COMMENT '缩略图',
  `simg2` varchar(200) DEFAULT NULL COMMENT '缩略图2',
  `wap_simg` varchar(200) DEFAULT NULL COMMENT '手机站缩略图',
  `width_height` varchar(100) DEFAULT NULL COMMENT '缩略图图片尺寸',
  `hit` int DEFAULT NULL,
  `download` varchar(300) DEFAULT NULL COMMENT '上传资料',
  `content` text COMMENT '详细内容',
  `target` varchar(8) DEFAULT '_blank' COMMENT '打开方式',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=512 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_ads_backup_before_slot_remap_20260324`
--

DROP TABLE IF EXISTS `web_ads_backup_before_slot_remap_20260324`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_ads_backup_before_slot_remap_20260324` (
  `id` mediumint NOT NULL DEFAULT '0',
  `title` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '名称',
  `subtitle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '副标题',
  `descs` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '描述',
  `bid` smallint DEFAULT '0' COMMENT '上级ID',
  `url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '外链地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `simg` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '缩略图',
  `simg2` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '缩略图2',
  `wap_simg` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '手机站缩略图',
  `width_height` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '缩略图图片尺寸',
  `hit` int DEFAULT NULL,
  `download` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '上传资料',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '详细内容',
  `target` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '_blank' COMMENT '打开方式'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_ads_type`
--

DROP TABLE IF EXISTS `web_ads_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_ads_type` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT '' COMMENT '广告分类名称',
  `width_height` varchar(100) DEFAULT '0' COMMENT '宽度',
  `wap_width_height` varchar(100) DEFAULT NULL COMMENT '手机缩略图尺寸',
  `simg2_width_height` varchar(100) DEFAULT NULL COMMENT '缩略图2尺寸',
  `ord` int DEFAULT '10' COMMENT '排序',
  `content` text COMMENT '详细内容',
  `wap_content` text COMMENT '手机站详细内容',
  `is_img` tinyint(1) DEFAULT '1' COMMENT '是否显示缩略图:0:不显示1:显示',
  `is_img2` tinyint(1) DEFAULT '0' COMMENT '是否显示缩略图2:0:不显示1:显示',
  `is_img_wap` tinyint(1) DEFAULT '1' COMMENT '是否显示手机缩略图:0:不显示1:显示',
  `is_download` tinyint(1) DEFAULT '0' COMMENT '是否显示上传资料:0:不显示1:显示',
  `is_descs` tinyint(1) DEFAULT '1' COMMENT '是否显示描述:0:不显示1:显示',
  `is_delete` tinyint(1) DEFAULT '1' COMMENT '是否删除',
  `is_url` tinyint(1) DEFAULT '1' COMMENT '是否显示链接地址:0:不显示1:显示',
  `is_subtitle` tinyint(1) DEFAULT '0' COMMENT '是否显示副标题0:不显示1:显示',
  `is_content` tinyint(1) DEFAULT '0' COMMENT '是否显示内容:0:不显示1:显示',
  `is_show` tinyint(1) DEFAULT '1' COMMENT '是否显示:0:不显示1:显示',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_article`
--

DROP TABLE IF EXISTS `web_article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_article` (
  `id` mediumint unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `title` varchar(300) DEFAULT NULL COMMENT '标题',
  `title_en` varchar(300) DEFAULT NULL COMMENT '英文名称',
  `subtitle` varchar(200) DEFAULT NULL COMMENT '副标题',
  `subtitle2` varchar(200) DEFAULT NULL COMMENT '短标题',
  `subtitle3` varchar(200) DEFAULT NULL,
  `bid` mediumint DEFAULT NULL COMMENT '栏目ID',
  `flag` varchar(300) DEFAULT NULL COMMENT '推荐标识',
  `simg` varchar(200) DEFAULT '' COMMENT '缩略图',
  `simg2` varchar(200) DEFAULT NULL,
  `simg3` varchar(200) DEFAULT NULL,
  `simg4` varchar(200) DEFAULT NULL COMMENT '小图',
  `simg5` varchar(200) DEFAULT NULL COMMENT '大图',
  `simgs` text COMMENT '图片集',
  `wap_simg` varchar(200) DEFAULT NULL COMMENT '手机缩略图',
  `publisher_id` int DEFAULT NULL COMMENT '发布者ID',
  `link_out` varchar(300) DEFAULT NULL,
  `gallery` text COMMENT '相册',
  `hit` int DEFAULT NULL COMMENT '访问量',
  `ord` mediumint DEFAULT '10' COMMENT '排序',
  `author` varchar(30) DEFAULT '' COMMENT '作者',
  `source` varchar(30) DEFAULT '' COMMENT '来源',
  `descs` varchar(300) DEFAULT '' COMMENT '描述',
  `descs2` varchar(300) DEFAULT NULL,
  `tags` varchar(300) DEFAULT NULL,
  `content` longtext COMMENT '详细内容',
  `content2` longtext,
  `content3` longtext,
  `content4` longtext,
  `extends` text COMMENT '扩展字段信息',
  `wap_content` longtext COMMENT '手机站详细内容',
  `type1` smallint DEFAULT NULL COMMENT '附加分类',
  `type2` smallint DEFAULT NULL,
  `type3` smallint DEFAULT NULL,
  `video` varchar(200) DEFAULT NULL COMMENT '视频地址',
  `download` varchar(200) DEFAULT NULL COMMENT '资料下载',
  `seoTitle` varchar(100) DEFAULT '',
  `seoKeyword` varchar(100) DEFAULT '',
  `setDescription` varchar(100) DEFAULT '',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态:显示:1;不显示0:-1回收站',
  `is_delete` smallint DEFAULT '0' COMMENT '是否允许删除 1:不允许;0:允许',
  `display_time` int DEFAULT NULL COMMENT '定时显示时间',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  `updatetime` int DEFAULT NULL,
  `click_nums` int DEFAULT '0',
  `more_link_cases` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3505 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_attribute`
--

DROP TABLE IF EXISTS `web_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_attribute` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT '' COMMENT '属性名称',
  `type` tinyint DEFAULT '1' COMMENT '1:栏目2:详细内容',
  `descs` varchar(300) DEFAULT NULL,
  `ord` smallint DEFAULT '10' COMMENT '排序',
  `is_show` tinyint DEFAULT '1' COMMENT '1:显示0:不显示',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_base`
--

DROP TABLE IF EXISTS `web_base`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_base` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT '' COMMENT '网站名称',
  `keyword` varchar(300) DEFAULT '' COMMENT '关键词',
  `descs` varchar(300) DEFAULT '' COMMENT '描述',
  `QQ` varchar(60) DEFAULT '' COMMENT '在线客服',
  `content` text COMMENT '内容',
  `content2` text COMMENT '底部版权',
  `QQName` varchar(60) DEFAULT '' COMMENT '客服名称',
  `isQQ` varchar(2) DEFAULT NULL COMMENT '开启QQ',
  `hot_kwd` varchar(500) DEFAULT NULL COMMENT '热门关键词',
  `company` varchar(150) DEFAULT NULL COMMENT '公司名称',
  `logo` varchar(200) DEFAULT NULL COMMENT 'Pclogo',
  `wap_logo` varchar(200) DEFAULT NULL COMMENT '手机站logo',
  `ico_logo` varchar(200) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL COMMENT '手机',
  `address` varchar(250) DEFAULT NULL COMMENT '地址',
  `video` varchar(300) DEFAULT NULL COMMENT '视频地址',
  `toolscode_bottom` text COMMENT '底部统计工具',
  `phone` varchar(50) DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `postcode` varchar(100) DEFAULT NULL,
  `hot_online` varchar(300) DEFAULT NULL COMMENT '在线咨询',
  `download` varchar(300) DEFAULT NULL COMMENT '下载资料',
  `toolscode_top` text COMMENT '头部统计工具',
  `wap_content` text COMMENT '手机站内容',
  `keyreplace` text COMMENT '替换关键词',
  `send_email` varchar(20) DEFAULT NULL,
  `weibo_simg` varchar(200) DEFAULT NULL COMMENT '微博图片',
  `weixin_simg` varchar(200) DEFAULT NULL COMMENT '微信图片',
  `douyin_simg` varchar(200) DEFAULT NULL,
  `wxurl` varchar(150) DEFAULT NULL COMMENT '微信地址',
  `wxappid` varchar(150) DEFAULT NULL COMMENT '微信appid',
  `wxappsecret` varchar(150) DEFAULT NULL COMMENT '微信秘钥',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_base_1202`
--

DROP TABLE IF EXISTS `web_base_1202`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_base_1202` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT '' COMMENT '网站名称',
  `keyword` varchar(300) DEFAULT '' COMMENT '关键词',
  `descs` varchar(300) DEFAULT '' COMMENT '描述',
  `QQ` varchar(60) DEFAULT '' COMMENT '在线客服',
  `content` text COMMENT '内容',
  `content2` text COMMENT '底部版权',
  `QQName` varchar(60) DEFAULT '' COMMENT '客服名称',
  `isQQ` varchar(2) DEFAULT NULL COMMENT '开启QQ',
  `hot_kwd` varchar(500) DEFAULT NULL COMMENT '热门关键词',
  `company` varchar(150) DEFAULT NULL COMMENT '公司名称',
  `logo` varchar(200) DEFAULT NULL COMMENT 'Pclogo',
  `wap_logo` varchar(200) DEFAULT NULL COMMENT '手机站logo',
  `ico_logo` varchar(200) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL COMMENT '手机',
  `address` varchar(250) DEFAULT NULL COMMENT '地址',
  `video` varchar(300) DEFAULT NULL COMMENT '视频地址',
  `toolscode_bottom` text COMMENT '底部统计工具',
  `phone` varchar(50) DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `postcode` varchar(100) DEFAULT NULL,
  `hot_online` varchar(300) DEFAULT NULL COMMENT '在线咨询',
  `download` varchar(300) DEFAULT NULL COMMENT '下载资料',
  `toolscode_top` text COMMENT '头部统计工具',
  `wap_content` text COMMENT '手机站内容',
  `keyreplace` text COMMENT '替换关键词',
  `send_email` varchar(20) DEFAULT NULL,
  `weibo_simg` varchar(200) DEFAULT NULL COMMENT '微博图片',
  `weixin_simg` varchar(200) DEFAULT NULL COMMENT '微信图片',
  `douyin_simg` varchar(200) DEFAULT NULL,
  `wxurl` varchar(150) DEFAULT NULL COMMENT '微信地址',
  `wxappid` varchar(150) DEFAULT NULL COMMENT '微信appid',
  `wxappsecret` varchar(150) DEFAULT NULL COMMENT '微信秘钥',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_base_12060941`
--

DROP TABLE IF EXISTS `web_base_12060941`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_base_12060941` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT '' COMMENT '网站名称',
  `keyword` varchar(300) DEFAULT '' COMMENT '关键词',
  `descs` varchar(300) DEFAULT '' COMMENT '描述',
  `QQ` varchar(60) DEFAULT '' COMMENT '在线客服',
  `content` text COMMENT '内容',
  `content2` text COMMENT '底部版权',
  `QQName` varchar(60) DEFAULT '' COMMENT '客服名称',
  `isQQ` varchar(2) DEFAULT NULL COMMENT '开启QQ',
  `hot_kwd` varchar(500) DEFAULT NULL COMMENT '热门关键词',
  `company` varchar(150) DEFAULT NULL COMMENT '公司名称',
  `logo` varchar(200) DEFAULT NULL COMMENT 'Pclogo',
  `wap_logo` varchar(200) DEFAULT NULL COMMENT '手机站logo',
  `ico_logo` varchar(200) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL COMMENT '手机',
  `address` varchar(250) DEFAULT NULL COMMENT '地址',
  `video` varchar(300) DEFAULT NULL COMMENT '视频地址',
  `toolscode_bottom` text COMMENT '底部统计工具',
  `phone` varchar(50) DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `postcode` varchar(100) DEFAULT NULL,
  `hot_online` varchar(300) DEFAULT NULL COMMENT '在线咨询',
  `download` varchar(300) DEFAULT NULL COMMENT '下载资料',
  `toolscode_top` text COMMENT '头部统计工具',
  `wap_content` text COMMENT '手机站内容',
  `keyreplace` text COMMENT '替换关键词',
  `send_email` varchar(20) DEFAULT NULL,
  `weibo_simg` varchar(200) DEFAULT NULL COMMENT '微博图片',
  `weixin_simg` varchar(200) DEFAULT NULL COMMENT '微信图片',
  `douyin_simg` varchar(200) DEFAULT NULL,
  `wxurl` varchar(150) DEFAULT NULL COMMENT '微信地址',
  `wxappid` varchar(150) DEFAULT NULL COMMENT '微信appid',
  `wxappsecret` varchar(150) DEFAULT NULL COMMENT '微信秘钥',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_category_type`
--

DROP TABLE IF EXISTS `web_category_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_category_type` (
  `id` mediumint NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `title` varchar(150) DEFAULT NULL COMMENT '名称',
  `english` varchar(100) DEFAULT 'Category' COMMENT '伪静态地址',
  `title_en` varchar(150) DEFAULT NULL COMMENT '英文名称',
  `subtitle` varchar(200) DEFAULT NULL COMMENT '副标题',
  `subtitle2` varchar(200) DEFAULT NULL,
  `subtitle3` varchar(200) DEFAULT NULL,
  `pid` mediumint DEFAULT '0' COMMENT '所属分类ID',
  `type` char(5) DEFAULT 'page' COMMENT '单页:page列表:list',
  `type_1` tinyint DEFAULT NULL,
  `link` varchar(150) DEFAULT NULL COMMENT '导航链接地址',
  `pagesize` int DEFAULT '10' COMMENT '分页数量',
  `template_list` varchar(50) DEFAULT 'news' COMMENT '列表页模板',
  `template_view` varchar(50) DEFAULT 'news_view' COMMENT '详情页模板',
  `link_out` varchar(200) DEFAULT NULL COMMENT '外链地址',
  `ord` mediumint DEFAULT '10' COMMENT '排序',
  `is_nav` tinyint DEFAULT '1' COMMENT '是否在导航显示1:显示 0:不显示',
  `is_lower` smallint DEFAULT '0' COMMENT '是否允许添加下级',
  `is_delete` smallint DEFAULT '1' COMMENT '是否允许删除',
  `seoTitle` varchar(100) DEFAULT '' COMMENT 'seo标题',
  `seoKeyword` varchar(200) DEFAULT '' COMMENT 'seo关键词',
  `setDescription` varchar(300) DEFAULT '' COMMENT 'seo描述',
  `simg` varchar(200) DEFAULT NULL COMMENT '缩略图',
  `simg2` varchar(200) DEFAULT NULL COMMENT '缩略图2',
  `simg3` varchar(200) DEFAULT NULL COMMENT '缩略图3',
  `banner` varchar(200) DEFAULT NULL COMMENT '栏目Banner图',
  `wap_banner` varchar(200) DEFAULT NULL COMMENT '手机站栏目Banner图',
  `extends` text COMMENT '扩展字段信息',
  `url` varchar(200) DEFAULT '#' COMMENT 'Banner图链接地址',
  `wap_url` varchar(200) DEFAULT NULL COMMENT '手机Banner图链接地址',
  `descs` text COMMENT '描述',
  `is_open` int DEFAULT '0' COMMENT '0:未开启1:开启',
  `content` text COMMENT '详细内容',
  `content2` text,
  `content3` text COMMENT '栏目缩略图尺寸',
  `widthheight` varchar(300) DEFAULT NULL COMMENT '栏目缩略图尺寸',
  `wap_content` text,
  `longitude_latitude` varchar(100) DEFAULT NULL COMMENT '经纬度地址',
  `map_pc` text COMMENT 'pc端地图',
  `map_pad` text COMMENT '手机端地图',
  `map_wap` text COMMENT '手机端地图',
  `status` tinyint DEFAULT '1' COMMENT '0:不显示1:显示',
  `addtime` int DEFAULT NULL,
  `updatetime` int DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `english` (`english`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='分类栏目表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_logins`
--

DROP TABLE IF EXISTS `web_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_logins` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT '' COMMENT '登录用户名',
  `login_ip` varchar(30) DEFAULT NULL COMMENT '登录IP',
  `user_agent` varchar(500) DEFAULT '' COMMENT '浏览器 User-Agent',
  `type` mediumint DEFAULT '0' COMMENT '0普通1管理员',
  `addtime` int DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=968 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='登录日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_logs`
--

DROP TABLE IF EXISTS `web_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_logs` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT '' COMMENT '登录用户名',
  `title` varchar(200) DEFAULT NULL COMMENT '名称',
  `type` smallint DEFAULT '0' COMMENT '1:添加;2:修改;3:删除',
  `login_ip` varchar(30) DEFAULT NULL COMMENT '登录IP',
  `addtime` int DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2841 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='操作日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_message`
--

DROP TABLE IF EXISTS `web_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_message` (
  `id` mediumint NOT NULL AUTO_INCREMENT COMMENT '编号',
  `bid` int DEFAULT '1' COMMENT '分类ID',
  `title` varchar(200) DEFAULT NULL COMMENT '标题',
  `mname` varchar(50) DEFAULT NULL COMMENT '姓名',
  `address` varchar(100) DEFAULT NULL COMMENT '地址',
  `tel` varchar(50) DEFAULT NULL COMMENT '手机号',
  `source_tid` int DEFAULT NULL COMMENT '申请来源',
  `email` varchar(30) DEFAULT '' COMMENT '邮箱',
  `age` char(5) DEFAULT NULL,
  `descs` varchar(300) DEFAULT NULL,
  `check_status` tinyint DEFAULT '0',
  `read_status` tinyint(1) DEFAULT '0' COMMENT '0:未读;1:已读',
  `extends` text COMMENT '扩展信息',
  `content` varchar(255) DEFAULT '' COMMENT '留言内容',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  `source` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '来源',
  `article_id` int DEFAULT NULL,
  `article_score` int DEFAULT NULL,
  `scale` varchar(50) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6325 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_pictures`
--

DROP TABLE IF EXISTS `web_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_pictures` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `bid` smallint DEFAULT '0' COMMENT '栏目ID',
  `title` varchar(100) DEFAULT NULL COMMENT '名称',
  `subtitle` varchar(100) DEFAULT NULL,
  `simg` varchar(300) DEFAULT NULL COMMENT '缩略图',
  `descs` varchar(255) DEFAULT NULL COMMENT '描述',
  `url` varchar(100) DEFAULT NULL COMMENT '地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `content` text COMMENT '内容',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_setting`
--

DROP TABLE IF EXISTS `web_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_setting` (
  `id` tinyint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `is_banner` tinyint DEFAULT '0' COMMENT '是否开启Banner',
  `is_banner_url` tinyint DEFAULT '0' COMMENT 'Banner图地址',
  `is_english_open` tinyint DEFAULT '0' COMMENT '开启英文版',
  `is_wap_open` tinyint DEFAULT '0' COMMENT '开始手机版',
  `is_wap_banner` tinyint DEFAULT '0' COMMENT '手机站Banner',
  `is_wap_banner_url` tinyint DEFAULT '0' COMMENT '手机站Banner链接',
  `is_keyreplace` tinyint DEFAULT '0' COMMENT '0:关闭1:开启',
  `is_tags` tinyint DEFAULT NULL,
  `is_open_cache` tinyint DEFAULT '0' COMMENT '0:不开启;1:开启',
  `is_open_close` tinyint DEFAULT '0' COMMENT '0',
  `logo_size` varchar(200) DEFAULT NULL COMMENT 'Logo尺寸',
  `banner_size` varchar(200) DEFAULT NULL COMMENT 'Banner图尺寸',
  `wap_banner_size` varchar(100) DEFAULT NULL COMMENT '手机Banner图尺寸',
  `show_imgs_size` varchar(200) DEFAULT '' COMMENT '图片集尺寸',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_show_info`
--

DROP TABLE IF EXISTS `web_show_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_show_info` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `bid` smallint DEFAULT '0' COMMENT '栏目ID',
  `title` varchar(100) DEFAULT '' COMMENT '名称',
  `subtitle` varchar(100) DEFAULT NULL,
  `simg` varchar(300) DEFAULT '' COMMENT '缩略图',
  `descs` varchar(255) DEFAULT '' COMMENT '描述',
  `url` varchar(100) DEFAULT '' COMMENT '链接地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `content` text COMMENT '内容',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_simgs`
--

DROP TABLE IF EXISTS `web_simgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_simgs` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `bid` smallint DEFAULT '0' COMMENT '栏目ID',
  `title` varchar(100) DEFAULT '' COMMENT '名称',
  `subtitle` varchar(100) DEFAULT NULL,
  `simg` varchar(300) DEFAULT '' COMMENT '缩略图',
  `simg2` varchar(300) DEFAULT NULL,
  `descs` varchar(255) DEFAULT '' COMMENT '描述',
  `url` varchar(100) DEFAULT '' COMMENT '链接地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `content` text COMMENT '内容',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_simgs2`
--

DROP TABLE IF EXISTS `web_simgs2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_simgs2` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `bid` smallint DEFAULT '0' COMMENT '栏目ID',
  `title` varchar(100) DEFAULT '' COMMENT '名称',
  `subtitle` varchar(100) DEFAULT NULL,
  `simg` varchar(300) DEFAULT '' COMMENT '缩略图',
  `descs` varchar(255) DEFAULT '' COMMENT '描述',
  `url` varchar(100) DEFAULT '' COMMENT '链接地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `content` text COMMENT '内容',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_simgs3`
--

DROP TABLE IF EXISTS `web_simgs3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_simgs3` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `bid` smallint DEFAULT '0' COMMENT '栏目ID',
  `title` varchar(100) DEFAULT '' COMMENT '名称',
  `subtitle` varchar(100) DEFAULT NULL,
  `simg` varchar(300) DEFAULT '' COMMENT '缩略图',
  `descs` varchar(255) DEFAULT '' COMMENT '描述',
  `url` varchar(100) DEFAULT '' COMMENT '链接地址',
  `ord` int DEFAULT '10' COMMENT '排序',
  `content` text COMMENT '内容',
  `addtime` int DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `web_template`
--

DROP TABLE IF EXISTS `web_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_template` (
  `id` mediumint NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT '' COMMENT '模板名称',
  `type` varchar(20) DEFAULT 'page' COMMENT '模板类型:单页:page;列表:list',
  `remarks` varchar(300) DEFAULT NULL COMMENT 'PC缩略图尺寸',
  `category_remarks` varchar(300) DEFAULT NULL COMMENT '栏目备注',
  `link` varchar(200) DEFAULT NULL COMMENT '模板地址',
  `descs` varchar(255) DEFAULT '' COMMENT '备注信息',
  `template_name` varchar(50) DEFAULT NULL COMMENT '模板名称',
  `simg` varchar(300) DEFAULT NULL COMMENT '模板缩略图',
  `status` tinyint DEFAULT '1' COMMENT '1:显示0:不显示',
  `attribute_type` varchar(300) DEFAULT '0,4,9,16',
  `attribute` varchar(300) DEFAULT NULL COMMENT '0,4,5,6,9,16',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'jfyzcms_db01'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13 14:16:54
