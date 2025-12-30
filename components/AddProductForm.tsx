'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'

interface AddProductFormProps {
  onAdd: (product: { name: string; imageUrl: string; link: string; asin?: string }) => void
  disabled?: boolean
}

export default function AddProductForm({ onAdd, disabled }: AddProductFormProps) {
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [link, setLink] = useState('')
  const [asin, setAsin] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !link) {
      alert('商品名とリンクは必須です')
      return
    }
    
    onAdd({ name, imageUrl, link, asin: asin || undefined })
    setName('')
    setImageUrl('')
    setLink('')
    setAsin('')
    setIsOpen(false)
  }

  const handleAmazonSearch = async () => {
    if (!asin) {
      alert('ASINを入力してください')
      return
    }
    
    try {
      const response = await fetch(`/api/amazon?asin=${encodeURIComponent(asin)}`)
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        return
      }
      
      setName(data.title || name)
      setImageUrl(data.imageUrl || imageUrl)
      setLink(data.link || link)
    } catch (error) {
      alert('Amazon商品情報の取得に失敗しました')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-gray-600"
      >
        <Plus size={20} />
        <span>商品を追加</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
      <h3 className="text-lg font-semibold mb-4">商品を追加</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ASIN（オプション - Amazon商品検索用）
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              placeholder="B08N5WRWNW"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAmazonSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Search size={16} />
              検索
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            画像URL（オプション）
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品リンク <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            placeholder="https://www.amazon.co.jp/dp/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={disabled}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false)
            setName('')
            setImageUrl('')
            setLink('')
            setAsin('')
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

