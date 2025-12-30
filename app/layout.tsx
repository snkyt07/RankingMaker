import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '買ってよかったものランキング',
  description: 'お気に入りの商品をランキング形式で共有しよう',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

