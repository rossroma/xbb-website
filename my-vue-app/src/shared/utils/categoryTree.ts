/** 将扁平分类列表转为嵌套树结构（防循环引用） */
export const buildCategoryTree = (
  items: any[],
  pid: number = 0,
  visited: Set<number> = new Set(),
  depth: number = 0,
  maxDepth: number = 50,
): any[] => {
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