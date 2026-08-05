/** 扁平分类节点（仅包含树构建所需的最小字段） */
interface CategoryNode {
  id: number
  pid: number
  ord?: number
}

/** 将扁平分类列表转为嵌套树结构（防循环引用） */
export const buildCategoryTree = <T extends CategoryNode>(
  items: T[],
  pid: number = 0,
  visited: Set<number> = new Set(),
  depth: number = 0,
  maxDepth: number = 50,
): (T & { children: T[] })[] => {
  if (depth > maxDepth || visited.has(pid)) return []
  visited.add(pid)
  return items
    .filter((c) => c.pid === pid)
    .sort((a, b) => (a.ord ?? 10) - (b.ord ?? 10))
    .map((c) => ({
      ...c,
      children: buildCategoryTree(items, c.id, new Set(visited), depth + 1, maxDepth),
    }))
}