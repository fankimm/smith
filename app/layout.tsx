import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'D2R Counter - 디아블로 2 레저렉션 사냥터 카운터',
  description: '디아블로 2 레저렉션 게임에서 사냥터별 런 횟수와 드랍된 아이템을 기록하는 웹앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}