// ========== 销售管理页面 SEO 配置 ==========
import {
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
import type { ImageCardGridItem } from '@/client/components/business/ImageCardGrid.vue'
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')


// ========== Hero 区域 ==========
export const heroSection = {
  title: '销售管理',
  subtitle: '精细化运营',
  desc:'支持 AI 销售陪练，自动生成训练任务赋能团队成长，客户跟进全程可追溯，访客与签到管理让外勤过程透明闭环，全面提升销售执行效率与业绩产出',
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
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: heroSection.desc,
  highlightMode: 'title',
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

// ========== AI 销售陪练区域（ImageCardGrid） ==========
export const aiCoachSection = {
  title: 'AI 销售陪练，让每个销售都练在关键处',
  description:
    'AI CRM 基于真实沟通数据分析销售薄弱环节，自动生成陪练任务；沉淀话术、产品知识与异议处理，系统化支撑新人培训与团队复训。Web/移动端多端可用，AI 即时评分并输出报告，便于追踪完成情况和能力变化，培训更精准、更可持续。',
  cards: [
    {
      title: '自动生成任务',
      description:
        '从真实沟通中识别问题，一键生成陪练主题和客户画像，减少主管手动设计训练场景的成本。',
      image: '/images/sales/auto-task.png',
      imageAlt: '自动生成任务展示图',
    },
    {
      title: '固定主题复用',
      description:
        '将优秀话术、产品知识、异议处理等沉淀为标准训练内容，支持新人反复练、团队周期练。',
      image: '/images/sales/reusable-topic.png',
      imageAlt: '固定主题复用展示图',
    },
    {
      title: '双端练习即时反馈',
      description:
        'Web 和移动端均可练习，AI 实时评分，自动生成练习报告，帮助销售快速改进表达和应对能力。',
      image: '/images/sales/dual-feedback.png',
      imageAlt: '双端练习即时反馈展示图',
    },
    {
      title: '数据闭环追踪',
      description:
        '练习次数、完成情况、得分排名、能力维度一目了然，方便主管做表扬、辅导和复训安排。',
      image: '/images/sales/data-loop.png',
      imageAlt: '数据闭环追踪展示图',
    },
  ] as readonly ImageCardGridItem[],
}

// ========== AI 过程透明化区域（TabShowcase） ==========
export const transparentSection = {
  title: 'AI 过程透明化，让每一步都有据可查',
  subtitle: 'AI CRM 自动记录并分析和客户的每一次沟通、每一次跟进，将散落在不同环节的沟通内容完整串联。\n无论是通话内容摘要、客户意向变化还是商机推进节奏，都可实时追踪、回溯复盘，让管理不再凭感觉、考核不再靠猜测。',
  tabs: [
    {
      key: 'traceable',
      label: '客户跟进全程可追溯',
      description:
        '每一条线索从分配到触达、从沟通到转化，全链路记录不遗漏。客户为什么丢了、卡在哪一步、谁的跟进出问题了，数据替你找答案。',
      image: '/images/sales/followup-trace.png',
      imageAlt: '客户跟进追溯功能截图',
      badgeIcon: History,
    },
    {
      key: 'data-driven',
      label: '管理决策有据可依',
      description:
        '团队整体沟通数据自动汇总为可视化看板，个人排名实时呈现，管理决策不再凭感觉、拍脑袋。',
      image: '/images/sales/data-driven.png',
      imageAlt: '管理决策数据看板截图',
      badgeIcon: DataDisplay,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 访客计划区域（TabShowcase） ==========
export const visitPlanSection = {
  title: '访客计划，让每一次拜访都形成闭环',
  subtitle:'以客户为出发点制定拜访计划，通过日历视图掌握团队每日/每周/每月访客安排。\n签到签退、跟进记录自动关联，形成「计划→执行→复盘」完整闭环。',
  tabs: [
    {
      key: 'quick-create',
      label: '多入口快捷创建',
      description:
        '客户详情页、首页看板、批量导入，从客户出发一键建立访客计划，让计划制定不再繁琐。',
      image: '/images/sales/quick-create.png',
      imageAlt: '访客计划创建功能截图',
      badgeIcon: AddOne,
    },
    {
      key: 'calendar',
      label: '日历视图 + 数据总览',
      description:
        '月/周日历视图一目了然，颜色标记状态——未开始/进行中/已完成/已逾期，团队拜访安排尽在掌控。',
      image: '/images/sales/calendar-view.png',
      imageAlt: '访客日历视图截图',
      badgeIcon: Calendar,
    },
    {
      key: 'auto-close',
      label: '执行 → 关联 → 自动完成',
      description: '签到、写跟进自动关联访客计划，任务完成后自动结算，审批闭环。',
      image: '/images/sales/auto-complete.png',
      imageAlt: '访客执行闭环截图',
      badgeIcon: CheckOne,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 签到管理区域（TabShowcase） ==========
export const checkinSection = {
  title: '签到管理，让外勤考勤一目了然',
  subtitle:'GPS精准定位签到签退，支持极速/标准双模式\n外勤轨迹一目了然，签退自动生成跟进记录——让每一次外出都有据可查，再也不用担心销售"放羊"。',
  tabs: [
    {
      key: 'dual-mode',
      label: '双模式签到签退',
      description:
        '极速模式一键签到，标准模式支持签退自动写跟进；支持设置签到范围、超时补签，灵活适配不同外勤场景。',
      image: '/images/sales/dual-checkin.png',
      imageAlt: '签到签退功能截图',
      badgeIcon: CheckOne,
    },
    {
      key: 'multi-address',
      label: '多地址 + 轨迹追踪',
      description:
        '支持客户/线索多地址签到，地图/轨迹视图切换，拜访时长自动统计，外勤轨迹一目了然。',
      image: '/images/sales/track-trace.png',
      imageAlt: '轨迹追踪功能截图',
      badgeIcon: Local,
    },
    {
      key: 'auto-record',
      label: '签到 → 自动沉淀',
      description:
        '签退自动生成跟进记录、关联访客计划，客户旅程中完整呈现签到历史，让每一次外勤签到都有据可查。',
      image: '/images/sales/auto-record.png',
      imageAlt: '签到自动沉淀截图',
      badgeIcon: FileText,
    },
    {
      key: 'pdca',
      label: 'PDCA 闭环',
      description:
        '从制定拜访计划、现场签到执行、填写跟进记录，到主管复盘拜访结果，系统完整串联 Plan-Do-Check-Act 管理闭环。主管不仅能看到计划有没有完成，还能基于逾期情况、客户反馈和跟进质量，持续优化拜访节奏、客户分配和销售动作。',
      image: '/images/sales/pdca-loop.png',
      imageAlt: 'PDCA 闭环截图',
      badgeIcon: Cycle,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 工作报告区域（TabShowcase） ==========
export const workReportSection = {
  title: '工作报告，让团队汇报更轻、更清楚',
  subtitle:'日报、周报、拜访总结、项目进展都可以用工作报告统一沉淀。AI CRM 支持多种报告模板，员工可快速填写和提交\n管理者可集中查看、批阅和追踪阅读状态，让团队汇报更规范，管理反馈更及时。',
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
