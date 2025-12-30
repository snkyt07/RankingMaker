import { NextRequest, NextResponse } from 'next/server'
import { addProduct, removeProduct, reorderProducts } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { rankingId, name, imageUrl, link, asin } = await request.json()
    
    if (!rankingId || !name || !link) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }
    
    const product = addProduct(rankingId, {
      name,
      imageUrl: imageUrl || '',
      link,
      asin,
    })
    
    if (!product) {
      return NextResponse.json({ error: 'ランキングが見つかりません' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '製品の追加に失敗しました' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rankingId = searchParams.get('rankingId')
  const productId = searchParams.get('productId')
  
  if (!rankingId || !productId) {
    return NextResponse.json({ error: 'rankingIdとproductIdが必要です' }, { status: 400 })
  }
  
  const success = removeProduct(rankingId, productId)
  if (!success) {
    return NextResponse.json({ error: '製品が見つかりません' }, { status: 404 })
  }
  
  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
  try {
    const { rankingId, productIds } = await request.json()
    
    if (!rankingId || !Array.isArray(productIds)) {
      return NextResponse.json({ error: 'rankingIdとproductIdsが必要です' }, { status: 400 })
    }
    
    const success = reorderProducts(rankingId, productIds)
    if (!success) {
      return NextResponse.json({ error: '並べ替えに失敗しました' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '並べ替えに失敗しました' }, { status: 500 })
  }
}

