'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SortableProductList from '@/components/SortableProductList'
import AddProductForm from '@/components/AddProductForm'
import { Share2, Plus, ArrowLeft } from 'lucide-react'

interface Product {
  id: string
  name: string
  imageUrl: string
  link: string
  rank: number
}

interface Ranking {
  id: string
  title: string
  createdAt: string
  products: Product[]
}

function RankingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rankingId = searchParams.get('id')
  
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (rankingId) {
      loadRanking(rankingId)
    } else {
      setLoading(false)
    }
  }, [rankingId])

  const loadRanking = async (id: string) => {
    try {
      const response = await fetch(`/api/rankings?id=${id}`)
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      setRanking(data)
      setTitle(data.title)
    } catch (error) {
      alert('ランキングの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const createRanking = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください')
      return
    }
    
    setIsCreating(true)
    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      router.push(`/?id=${data.id}`)
    } catch (error) {
      alert('ランキングの作成に失敗しました')
    } finally {
      setIsCreating(false)
    }
  }

  const updateTitle = async (newTitle: string) => {
    if (!ranking) return
    
    try {
      const response = await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ranking.id, title: newTitle }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      setRanking(data)
    } catch (error) {
      alert('タイトルの更新に失敗しました')
    }
  }

  const addProduct = async (product: { name: string; imageUrl: string; link: string; asin?: string }) => {
    if (!ranking) return
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rankingId: ranking.id, ...product }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      await loadRanking(ranking.id)
    } catch (error) {
      alert('商品の追加に失敗しました')
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!ranking) return
    if (!confirm('この商品を削除しますか？')) return
    
    try {
      const response = await fetch(`/api/products?rankingId=${ranking.id}&productId=${productId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      await loadRanking(ranking.id)
    } catch (error) {
      alert('商品の削除に失敗しました')
    }
  }

  const reorderProducts = async (productIds: string[]) => {
    if (!ranking) return
    
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rankingId: ranking.id, productIds }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      await loadRanking(ranking.id)
    } catch (error) {
      alert('並べ替えに失敗しました')
    }
  }

  const shareRanking = () => {
    if (!ranking) return
    
    const url = `${window.location.origin}/?id=${ranking.id}`
    navigator.clipboard.writeText(url).then(() => {
      alert('リンクをクリップボードにコピーしました！')
    }).catch(() => {
      prompt('このリンクをコピーしてください:', url)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (!ranking) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">買ってよかったものランキング</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ランキングタイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: 2024年買ってよかったものTOP20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && createRanking()}
                />
              </div>
              
              <button
                onClick={createRanking}
                disabled={isCreating || !title.trim()}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                <Plus size={20} />
                新しいランキングを作成
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            <span>ホームに戻る</span>
          </button>
          
          <button
            onClick={shareRanking}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Share2 size={18} />
            共有
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              updateTitle(e.target.value)
            }}
            className="text-3xl font-bold w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -mx-2"
          />
          <p className="text-gray-500 text-sm mt-2">
            {ranking.products.length} / 20 商品
          </p>
        </div>
        
        <div className="space-y-6">
          {ranking.products.length > 0 && (
            <SortableProductList
              products={ranking.products}
              onReorder={reorderProducts}
              onDelete={deleteProduct}
            />
          )}
          
          {ranking.products.length < 20 && (
            <AddProductForm
              onAdd={addProduct}
              disabled={ranking.products.length >= 20}
            />
          )}
          
          {ranking.products.length >= 20 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center text-yellow-800">
              最大20位まで追加できます
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    }>
      <RankingContent />
    </Suspense>
  )
}

