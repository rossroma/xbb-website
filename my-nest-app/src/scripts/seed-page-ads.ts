/**
 * 种子脚本：将首页 Banner / 关于我们权威认可 / 联系我们公司地址的硬编码数据
 * 导入 web_ads_type + web_ads 表，供运营人员在后台管理。
 *
 * 用法：npx ts-node -r tsconfig-paths/register src/scripts/seed-page-ads.ts
 *
 * 幂等：重复执行不会产生重复数据（按 title + bid 去重）
 */

import dataSource from '../database/data-source-cli';

// ========== 广告位定义 ==========
const adTypes = [
  { id: 1, title: '首页-Banner轮播', ord: 1, is_show: 1 },
  { id: 2, title: '关于我们-权威认可', ord: 2, is_show: 1 },
  { id: 3, title: '联系我们-公司地址', ord: 3, is_show: 1 },
];

// ========== 广告条目 ==========

/** 首页 Banner 轮播（bid=1）— 4 张轮播图 */
const bannerAds = [
  {
    bid: 1,
    title: '懂客户，更懂增长',
    subtitle: '销帮帮 AI CRM',
    descs: '专注于客户数字化\n让增长不再是靠感觉，而是靠系统',
    simg: '',
    content: '了解更多',
    ord: 1,
  },
  {
    bid: 1,
    title: '让每一次客户互动\n都转化为增长',
    subtitle: 'AI 驱动的新一代智能 CRM',
    descs: '从获客到成交复购，AI 帮你看准每一个商机，不浪费任何一个潜在机会。',
    simg: '/images/banner2.png',
    content: '了解更多',
    ord: 2,
  },
  {
    bid: 1,
    title: '数据说话\n见证企业增长奇迹',
    subtitle: '40万+企业信赖的选择',
    descs: '覆盖科技、教育、医疗、建筑等30+行业',
    simg: '/images/banner3.png',
    content: '查看客户案例',
    ord: 3,
  },
  {
    bid: 1,
    title: '现在注册',
    subtitle: '新客专享 · 限时体验',
    descs: '0元试用 · 全功能开放 · 预约专属顾问1对1服务',
    simg: '',
    content: '立即免费注册',
    ord: 4,
  },
];

/** 关于我们-权威认可（bid=2）— 15 条资质 */
const recognitionAds = [
  { bid: 2, title: '浙江省专精特新中小企业', ord: 1 },
  { bid: 2, title: '2021信息技术优秀产品', ord: 2 },
  { bid: 2, title: '杭州市科技型初创企业培育工程企业', ord: 3 },
  { bid: 2, title: '质量管理体系认证证书（ISO9001）', ord: 4 },
  { bid: 2, title: '优秀雏鹰企业', ord: 5 },
  { bid: 2, title: '信息安全管理体系认证证书（ISO27001）', ord: 6 },
  { bid: 2, title: '隐私信息管理体系认证证书（ISO27701）', ord: 7 },
  { bid: 2, title: '2022年度瞪羚企业', ord: 8 },
  { bid: 2, title: 'CMMI Maturity Level 3', ord: 9 },
  { bid: 2, title: '2023年杭州市准独角兽企业', ord: 10 },
  { bid: 2, title: '浙江省科技型中小企业', ord: 11 },
  { bid: 2, title: '高新技术企业', ord: 12 },
  { bid: 2, title: '省级高新技术企业研究开发中心', ord: 13 },
  { bid: 2, title: '软件产品证书（T/SIA003 2019）', ord: 14 },
  { bid: 2, title: '杭州市企业高新技术研发中心（工业类）', ord: 15 },
];

/** 联系我们-公司地址（bid=3）— 4 个城市 */
const addressAds = [
  {
    bid: 3,
    title: '杭州（总部）',
    descs: '杭州市滨江区滨盛路1505号银丰大厦17层',
    simg: '/images/nnlx_mimg.jpg',
    ord: 1,
  },
  {
    bid: 3,
    title: '北京',
    descs: '朝阳区建国门外大街永安东里甲3号通用国际中心A座9层905-2',
    simg: '/images/nnlx_mimg.jpg',
    ord: 2,
  },
  {
    bid: 3,
    title: '上海',
    descs: '上海市杨浦区昆明路739号文通大厦1009室',
    simg: '/images/nnlx_mimg.jpg',
    ord: 3,
  },
  {
    bid: 3,
    title: '深圳',
    descs: '南山区高新南九道53号航空航天大厦2号楼801室',
    simg: '/images/nnlx_mimg.jpg',
    ord: 4,
  },
];

// ========== 主流程 ==========
async function seed() {
  await dataSource.initialize();
  console.log('✅ 数据库连接成功');

  const adsTypeRepo = dataSource.getRepository('AdsType');
  const adsRepo = dataSource.getRepository('Ads');

  // 1. 插入广告位（幂等：ON DUPLICATE KEY 不更新）
  for (const type of adTypes) {
    const existing = await adsTypeRepo.findOne({ where: { id: type.id } });
    if (existing) {
      console.log(`⏭️  广告位已存在: [${type.id}] ${type.title}`);
    } else {
      await adsTypeRepo.save(type);
      console.log(`✅ 创建广告位: [${type.id}] ${type.title}`);
    }
  }

  // 2. 插入广告条目（幂等：按 title + bid 去重）
  const allAds = [
    ...bannerAds.map((a) => ({ ...a, target: '_blank', url: '' })),
    ...recognitionAds.map((a) => ({ ...a, target: '_blank', url: '', descs: '', simg: '', content: '' })),
    ...addressAds.map((a) => ({ ...a, target: '_blank', url: '', content: '' })),
  ];

  let inserted = 0;
  let skipped = 0;
  for (const ad of allAds) {
    const existing = await adsRepo.findOne({ where: { title: ad.title, bid: ad.bid } });
    if (existing) {
      skipped++;
    } else {
      await adsRepo.save(ad);
      inserted++;
    }
  }
  console.log(`✅ 广告条目: 新增 ${inserted} 条, 跳过 ${skipped} 条（已存在）`);

  await dataSource.destroy();
  console.log('🎉 种子数据导入完成');
}

seed().catch((err) => {
  console.error('❌ 种子脚本执行失败:', err.message);
  process.exit(1);
});