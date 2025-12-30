// シンプルなインメモリデータベース（本番環境では実際のDBに置き換える）
export interface Product {
  id: string
  name: string
  imageUrl: string
  link: string
  rank: number
  asin?: string
}

export interface Ranking {
  id: string
  title: string
  createdAt: string
  products: Product[]
}

// インメモリストレージ
let rankings: Map<string, Ranking> = new Map()

export function createRanking(title: string): Ranking {
  const id = Math.random().toString(36).substring(2, 15)
  const ranking: Ranking = {
    id,
    title,
    createdAt: new Date().toISOString(),
    products: [],
  }
  rankings.set(id, ranking)
  return ranking
}

export function getRanking(id: string): Ranking | undefined {
  return rankings.get(id)
}

export function updateRanking(id: string, updates: Partial<Ranking>): Ranking | undefined {
  const ranking = rankings.get(id)
  if (!ranking) return undefined
  
  const updated = { ...ranking, ...updates }
  rankings.set(id, updated)
  return updated
}

export function deleteRanking(id: string): boolean {
  return rankings.delete(id)
}

export function addProduct(rankingId: string, product: Omit<Product, 'id' | 'rank'>): Product | undefined {
  const ranking = rankings.get(rankingId)
  if (!ranking) return undefined
  
  if (ranking.products.length >= 20) {
    throw new Error('ランキングは20位までです')
  }
  
  const newProduct: Product = {
    ...product,
    id: Math.random().toString(36).substring(2, 15),
    rank: ranking.products.length + 1,
  }
  
  ranking.products.push(newProduct)
  rankings.set(rankingId, ranking)
  return newProduct
}

export function removeProduct(rankingId: string, productId: string): boolean {
  const ranking = rankings.get(rankingId)
  if (!ranking) return false
  
  const index = ranking.products.findIndex(p => p.id === productId)
  if (index === -1) return false
  
  ranking.products.splice(index, 1)
  // ランクを再計算
  ranking.products.forEach((p, i) => {
    p.rank = i + 1
  })
  rankings.set(rankingId, ranking)
  return true
}

export function reorderProducts(rankingId: string, productIds: string[]): boolean {
  const ranking = rankings.get(rankingId)
  if (!ranking) return false
  
  const productsMap = new Map(ranking.products.map(p => [p.id, p]))
  const reorderedProducts = productIds
    .map(id => productsMap.get(id))
    .filter((p): p is Product => p !== undefined)
  
  if (reorderedProducts.length !== ranking.products.length) return false
  
  reorderedProducts.forEach((p, i) => {
    p.rank = i + 1
  })
  
  ranking.products = reorderedProducts
  rankings.set(rankingId, ranking)
  return true
}

