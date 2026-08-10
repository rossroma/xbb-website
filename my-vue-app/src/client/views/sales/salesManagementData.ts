// ========== 销售管理页面 SEO 配置 ==========
import {
  Robot,
  LoopOnce,
  Monitor,
  Trend,
  History,
  DataDisplay,
  Calendar,
  AddOne,
  CheckOne,
  Local,
  FileText,
  Cycle,
  DocDetail,
  Edit,
  Filter,
  Comment,
} from '@/client/components/ui/remixIcons'
import type { TabShowcaseItem } from '@/client/components/business/TabShowcase.vue'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')


// ========== Hero 区域 ==========
export const heroSection = {
  title: '销售管理',
  subtitle: '精细化销售管理助力业绩增长',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  secondaryHref: trialPagePath,
  primaryHref: trialPagePath,
  image: '/images/sales/hero.png',
  imageAlt: '销售管理产品展示',
  bg: "url('/images/sales/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'sales-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  bg: heroSection.bg,
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 154, 77, 0.22)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: heroSection.imageAlt,
}

// ========== AI 销售陪练区域（BadgeCardGrid） ==========
export const aiCoachSection = {
  title: 'AI 销售陪练，让每个销售都练在关键处',
  description:
    'AI CRM 基于真实沟通数据分析销售薄弱环节，自动生成陪练任务；沉淀话术、产品知识与异议处理，系统化支撑新人培训与团队复训。Web/移动端多端可用，AI 即时评分并输出报告，便于追踪完成情况和能力变化，培训更精准、更可持续。',
  cards: [
    {
      icon: Robot,
      title: '自动生成任务',
      description:
        '从真实沟通中识别问题，一键生成陪练主题和客户画像，减少主管手动设计训练场景的成本。',
    },
    {
      icon: LoopOnce,
      title: '固定主题复用',
      description:
        '将优秀话术、产品知识、异议处理等沉淀为标准训练内容，支持新人反复练、团队周期练。',
    },
    {
      icon: Monitor,
      title: '双端练习即时反馈',
      description:
        'Web 和移动端均可练习，AI 实时评分，自动生成练习报告，帮助销售快速改进表达和应对能力。',
    },
    {
      icon: Trend,
      title: '数据闭环追踪',
      description:
        '练习次数、完成情况、得分排名、能力维度一目了然，方便主管做表扬、辅导和复训安排。',
    },
  ] as readonly FeatureItem[],
}

// ========== AI 过程透明化区域（TabShowcase） ==========
export const transparentSection = {
  title: 'AI 过程透明化，让每一步都有据可查',
  tabs: [
    {
      key: 'traceable',
      label: '客户跟进全程可追溯',
      description:
        '每一条线索从分配到触达、从沟通到转化，全链路记录不遗漏。客户为什么丢了、卡在哪一步、谁的跟进出问题了，数据替你找答案。',
      image: '/images/sales/tab-transparent-1.png',
      imageAlt: '客户跟进追溯功能截图',
      badgeIcon: History,
    },
    {
      key: 'data-driven',
      label: '管理决策有据可依',
      description:
        '团队整体沟通数据自动汇总为可视化看板，个人排名实时呈现，管理决策不再凭感觉、拍脑袋。',
      image: '/images/sales/tab-transparent-2.png',
      imageAlt: '管理决策数据看板截图',
      badgeIcon: DataDisplay,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 访客计划区域（TabShowcase） ==========
export const visitPlanSection = {
  title: '访客计划，让每一次拜访都形成闭环',
  tabs: [
    {
      key: 'quick-create',
      label: '多入口快捷创建',
      description:
        '客户详情页、首页看板、批量导入，从客户出发一键建立访客计划，让计划制定不再繁琐。',
      image: '/images/sales/tab-visit-1.png',
      imageAlt: '访客计划创建功能截图',
      badgeIcon: AddOne,
    },
    {
      key: 'calendar',
      label: '日历视图 + 数据总览',
      description:
        '月/周日历视图一目了然，颜色标记状态——未开始/进行中/已完成/已逾期，团队拜访安排尽在掌控。',
      image: '/images/sales/tab-visit-2.png',
      imageAlt: '访客日历视图截图',
      badgeIcon: Calendar,
    },
    {
      key: 'auto-close',
      label: '执行 → 关联 → 自动完成',
      description: '签到、写跟进自动关联访客计划，任务完成后自动结算，审批闭环。',
      image: '/images/sales/tab-visit-3.png',
      imageAlt: '访客执行闭环截图',
      badgeIcon: CheckOne,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 签到管理区域（TabShowcase） ==========
export const checkinSection = {
  title: '签到管理，让外勤考勤一目了然',
  tabs: [
    {
      key: 'dual-mode',
      label: '双模式签到签退',
      description:
        '极速模式一键签到，标准模式支持签退自动写跟进；支持设置签到范围、超时补签，灵活适配不同外勤场景。',
      image: '/images/sales/tab-checkin-1.png',
      imageAlt: '签到签退功能截图',
      badgeIcon: CheckOne,
    },
    {
      key: 'multi-address',
      label: '多地址 + 轨迹追踪',
      description:
        '支持客户/线索多地址签到，地图/轨迹视图切换，拜访时长自动统计，外勤轨迹一目了然。',
      image: '/images/sales/tab-checkin-2.png',
      imageAlt: '轨迹追踪功能截图',
      badgeIcon: Local,
    },
    {
      key: 'auto-record',
      label: '签到 → 自动沉淀',
      description:
        '签退自动生成跟进记录、关联访客计划，客户旅程中完整呈现签到历史，让每一次外勤签到都有据可查。',
      image: '/images/sales/tab-checkin-3.png',
      imageAlt: '签到自动沉淀截图',
      badgeIcon: FileText,
    },
    {
      key: 'pdca',
      label: 'PDCA 闭环',
      description:
        '从制定拜访计划、现场签到执行、填写跟进记录，到主管复盘拜访结果，系统完整串联 Plan-Do-Check-Act 管理闭环。主管不仅能看到计划有没有完成，还能基于逾期情况、客户反馈和跟进质量，持续优化拜访节奏、客户分配和销售动作。',
      image: '/images/sales/tab-checkin-4.png',
      imageAlt: 'PDCA 闭环截图',
      badgeIcon: Cycle,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 工作报告区域（TabShowcase） ==========
export const workReportSection = {
  title: '工作报告，让团队汇报更轻、更清楚',
  tabs: [
    {
      key: 'multi-template',
      label: '多报告模板，适配不同汇报场景',
      description:
        '支持配置多种工作报告模板，适用于销售日报、周报、客户拜访总结、项目进展、问题反馈等常见场景，让不同类型的汇报都有清晰格式。',
      image: '/images/sales/tab-report-1.png',
      imageAlt: '报告模板功能截图',
      badgeIcon: DocDetail,
    },
    {
      key: 'draft',
      label: '草稿暂存，写到一半也不丢',
      description:
        '报告填写过程中可自动保存草稿，员工临时切换任务或中断填写后，也能继续编辑，减少重复输入。',
      image: '/images/sales/tab-report-2.png',
      imageAlt: '草稿暂存功能截图',
      badgeIcon: Edit,
    },
    {
      key: 'unread-filter',
      label: '未读筛选，重点报告快速处理',
      description:
        '管理者可一键筛选未读报告，优先查看最新提交内容，避免客户风险、项目问题和团队反馈被遗漏。',
      image: '/images/sales/tab-report-3.png',
      imageAlt: '未读筛选功能截图',
      badgeIcon: Filter,
    },
    {
      key: 'review-cc',
      label: '批阅与抄送，反馈链路更清晰',
      description:
        '支持设置批阅人和抄送人，关键报告可同步给相关负责人。主管可以围绕报告内容进行批阅反馈，帮助团队及时对齐问题和下一步动作。',
      image: '/images/sales/tab-report-4.png',
      imageAlt: '批阅抄送功能截图',
      badgeIcon: Comment,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== Footer CTA 区域 ==========
export const footerCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  secondaryCta: '预约产品演示',
}
