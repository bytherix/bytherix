import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bx-navy flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[7rem] font-black leading-none text-bx-border select-none mb-4">404</p>
        <h1 className="text-2xl font-bold text-bx-white mb-3">Page not found</h1>
        <p className="text-bx-slate mb-8 text-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}