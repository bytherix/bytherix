'use client'

import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

interface DashboardHeaderProps {
  dateStr: string
}

export function DashboardHeader({ dateStr }: DashboardHeaderProps) {
  const { user } = useAuthStore()

  return (
    <header className="h-14 border-b border-bx-border bg-bx-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <p className="text-bx-slate text-sm">{dateStr}</p>
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-lg border border-bx-border flex items-center justify-center text-bx-muted hover:text-bx-white transition-colors" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-bx-blue" />
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bx-blue/20 border border-bx-blue/30 flex items-center justify-center">
              <span className="text-xs font-bold text-bx-blue">{user.firstName[0]}{user.lastName[0]}</span>
            </div>
            <span className="text-bx-white text-sm font-medium hidden sm:block">{user.firstName}</span>
          </div>
        )}
      </div>
    </header>
  )
}