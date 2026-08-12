/**
 * OSS 图片处理工具
 *
 * 对阿里云 OSS 图片自动添加尺寸处理参数，按实际渲染宽度等比缩放。
 * 避免用户上传的大图导致页面加载缓慢。
 *
 * 处理逻辑：
 * 1. 将 CSS 像素宽度乘以 devicePixelRatio（仅小图生效），确保 Retina 屏幕清晰
 * 2. 物理像素宽度上限 1920px，全幅大图不做 2x，避免文件过大
 * 3. 追加 quality 参数控制 JPEG 压缩质量，平衡清晰度与文件大小
 * 4. 非 OSS 图片或已有处理参数的 URL 原样返回
 *
 * 用法：
 * ```vue
 * <img :src="getOSSImageUrl(image, 280)" />
 * ```
 */

/** 图片上传至 OSS 的域名 */
const OSS_DOMAIN = 'xbbwww.xbongbong.com'

/** 物理像素宽度上限，超过此值不再做 2x 放大 */
const MAX_PHYSICAL_WIDTH = 1920

/**
 * 判断是否为 OSS 图片链接
 */
function isOSSImage(url: string): boolean {
  try {
    return new URL(url).hostname === OSS_DOMAIN
  } catch {
    return false
  }
}

/**
 * 获取 OSS 图片处理 URL
 *
 * @param url   - 原始图片 URL
 * @param width - 实际渲染宽度（CSS 像素），仅对 OSS 域名下的图片生效。
 *                小图（≤960px）自动乘以 devicePixelRatio 确保 Retina 清晰；
 *                大图直接使用原值，上限 1920px。
 *                传 undefined/null/0 时返回原 URL。
 * @returns 处理后的 URL，非 OSS 图片或已有处理参数时原样返回
 */
export function getOSSImageUrl(
  url: string | undefined | null,
  width?: number,
): string {
  if (!url) return ''
  if (!width || width <= 0) return url
  if (!isOSSImage(url)) return url
  // 已有处理参数，不重复追加
  if (url.includes('x-oss-process=')) return url

  // 小图（CSS 宽度 ≤ 960px）乘以 devicePixelRatio 确保 Retina 清晰；
  // 大图直接使用原值，避免 1920px 全幅图再翻倍浪费带宽
  const dpr = width <= 960
    ? Math.ceil(Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio : 1))
    : 1
  const physicalWidth = Math.min(width * dpr, MAX_PHYSICAL_WIDTH)

  // quality 参数：JPEG 质量 80%，平衡清晰度与文件体积
  return `${url}?x-oss-process=image/resize,w_${physicalWidth}/quality,q_80`
}