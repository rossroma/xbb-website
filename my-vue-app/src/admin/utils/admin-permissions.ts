export interface AdminProfileLike {
  id: number
  username: string
  type: number
  group_id: number
  status: number
  group_info?: {
    id: number
    title: string
    rules?: string
    rules_category?: string
  }
}

export interface MenuPermissionMeta {
  ruleTokens?: string[]
  categoryIds?: Array<number | string>
  allowSuperAdmin?: boolean
}

const parseCsv = (value?: string) =>
  (value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

export const parseRulesCategory = (value?: string): string[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item)).filter(Boolean)
    }
  } catch {
    return value
      .split(',')
      .map(item => item.replace(/[[\]"]+/g, '').trim())
      .filter(Boolean)
  }
  return []
}

export const getPermissionContext = (profile?: AdminProfileLike | null) => {
  const isSuperAdmin = profile?.type === 1
  const ruleSet = new Set(parseCsv(profile?.group_info?.rules))
  const categorySet = new Set(parseRulesCategory(profile?.group_info?.rules_category))

  return {
    isSuperAdmin,
    ruleSet,
    categorySet,
  }
}

export const hasMenuPermission = (
  profile: AdminProfileLike | null | undefined,
  permission?: MenuPermissionMeta,
) => {
  if (!permission) return true

  const { isSuperAdmin, ruleSet, categorySet } = getPermissionContext(profile)

  if (isSuperAdmin && permission.allowSuperAdmin !== false) return true

  const ruleAllowed = !permission.ruleTokens?.length || permission.ruleTokens.some(token => ruleSet.has(String(token)))
  const categoryAllowed = !permission.categoryIds?.length || permission.categoryIds.some(id => categorySet.has(String(id)))

  return ruleAllowed && categoryAllowed
}
