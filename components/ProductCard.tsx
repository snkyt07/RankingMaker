'use client'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
  product: {
    id: string
    name: string
    imageUrl: string
    link: string
    rank: number
  }
  onDelete: (id: string) => void
  isDragging?: boolean
}

export default function ProductCard({ product, onDelete, isDragging }: ProductCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:border-blue-500 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl font-bold text-gray-400">
            {product.rank}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {product.imageUrl && (
            <div className="mb-2">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={100}
                height={100}
                className="rounded object-cover"
                unoptimized
              />
            </div>
          )}
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {product.link}
          </a>
        </div>
        
        <button
          onClick={() => onDelete(product.id)}
          className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          aria-label="削除"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}

