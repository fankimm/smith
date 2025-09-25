'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHydrated } from '@/hooks/useHydrated'

export function Navigation() {
  const hydrated = useHydrated()
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: '카운터',
      icon: Activity,
    },
    {
      href: '/dashboard',
      label: '대시보드',
      icon: BarChart3,
    },
  ]

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-semibold">
              D2R Counter
            </div>
          </Link>

          <div className="flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = hydrated ? pathname === item.href : false

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}