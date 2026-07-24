import type { Metadata } from 'next'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { ContinueLearning } from '@/components/dashboard/ContinueLearning'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bx-white">Dashboard</h1>
        <p className="text-bx-slate text-sm mt-1">Welcome back! Here&apos;s your learning progress.</p>
      </div>
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ContinueLearning /></div>
        <div><RecentActivity /></div>
      </div>
    </div>
  )
}