import { NextRequest, NextResponse } from 'next/server'
import { createRanking, getRanking, updateRanking, deleteRanking } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'タイトルが必要です' }, { status: 400 })
    }
    
    const ranking = createRanking(title)
    return NextResponse.json(ranking)
  } catch (error) {
    return NextResponse.json({ error: 'ランキングの作成に失敗しました' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (id) {
    const ranking = getRanking(id)
    if (!ranking) {
      return NextResponse.json({ error: 'ランキングが見つかりません' }, { status: 404 })
    }
    return NextResponse.json(ranking)
  }
  
  return NextResponse.json({ error: 'IDが必要です' }, { status: 400 })
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'IDが必要です' }, { status: 400 })
    }
    
    const ranking = updateRanking(id, updates)
    if (!ranking) {
      return NextResponse.json({ error: 'ランキングが見つかりません' }, { status: 404 })
    }
    
    return NextResponse.json(ranking)
  } catch (error) {
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'IDが必要です' }, { status: 400 })
  }
  
  const success = deleteRanking(id)
  if (!success) {
    return NextResponse.json({ error: 'ランキングが見つかりません' }, { status: 404 })
  }
  
  return NextResponse.json({ success: true })
}

