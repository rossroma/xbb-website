/** 渐变主题（10 色，全组件通用） */
export type Theme =
  | 'purple'
  | 'blue'
  | 'teal'
  | 'green'
  | 'orange'
  | 'plain'
  | 'slate'
  | 'indigo'
  | 'amber'
  | 'sky'

/** 渐变主题 → bg-fi-* 径向渐变背景类名 */
export const THEME_BG_CLASS: Record<Theme, string> = {
  purple: 'bg-fi-purple',
  blue: 'bg-fi-blue',
  teal: 'bg-fi-teal',
  green: 'bg-fi-green',
  orange: 'bg-fi-orange',
  plain: 'bg-fi-plain',
  slate: 'bg-fi-slate',
  indigo: 'bg-fi-indigo',
  amber: 'bg-fi-amber',
  sky: 'bg-fi-sky',
}

/** 渐变主题 → bg-fs-icon-* 图标徽章背景类名 */
export const THEME_ICON_BADGE_CLASS: Record<Theme, string> = {
  purple: 'bg-fs-icon-purple',
  blue: 'bg-fs-icon-blue',
  teal: 'bg-fs-icon-teal',
  green: 'bg-fs-icon-green',
  orange: 'bg-fs-icon-orange',
  plain: 'bg-fs-icon-plain',
  slate: 'bg-fs-icon-slate',
  indigo: 'bg-fs-icon-indigo',
  amber: 'bg-fs-icon-amber',
  sky: 'bg-fs-icon-sky',
}

/** 渐变主题 → 主色值（用于内联 style） */
export const THEME_PRIMARY_COLOR: Record<Theme, string> = {
  purple: '#7c5cff',
  blue: '#4a7fd9',
  teal: '#0ea5a9',
  green: '#10b981',
  orange: '#ff6400',
  plain: '#64748b',
  slate: '#64748b',
  indigo: '#6366f1',
  amber: '#f59e0b',
  sky: '#0ea5e9',
}

/** 渐变主题 → text-fi-title-* 标题文字渐变类名 */
export const THEME_TITLE_GRADIENT_CLASS: Record<Theme, string> = {
  purple: 'text-fi-title-purple',
  blue: 'text-fi-title-blue',
  teal: 'text-fi-title-teal',
  green: 'text-fi-title-green',
  orange: 'text-fi-title-orange',
  plain: 'text-fi-title-plain',
  slate: 'text-fi-title-slate',
  indigo: 'text-fi-title-indigo',
  amber: 'text-fi-title-amber',
  sky: 'text-fi-title-sky',
}
