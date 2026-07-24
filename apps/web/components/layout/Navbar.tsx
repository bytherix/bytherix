'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, Shield } from 'lucide-react'
import { DHOverlay } from '@/components/demon-hunters/DHOverlay'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Training', href: '/training' },
  { label: 'Projects', href: '/projects' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
]

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dhOpen,     setDhOpen]     = useState(false)
  const pathname = usePathname()

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--bg-base)]/95 backdrop-blur-xl border-b border-[var(--border)]'
            : 'bg-transparent'
        )}
      >
       <nav
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[var(--nav-height)] flex items-center justify-between"
  aria-label="Main navigation"
>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Bytherix home">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-[var(--border)] group-hover:ring-[var(--color-brand-blue)] transition-all duration-200">
              <Image src="/logo.jpg" alt="Bytherix" fill sizes="36px" className="object-cover" priority />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-[var(--text-primary)]">By</span>
              <span className="text-[var(--color-brand-blue)]">the</span>
              <span className="text-[var(--color-brand-green)]">rix</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                    active
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-[var(--color-brand-blue)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* DH button */}
            <button
              onClick={() => setDhOpen(true)}
              className="relative group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-brand-red-muted)] hover:bg-[var(--color-brand-red-muted)] transition-all duration-200"
              aria-label="Open Demon Hunters"
            >
              <Shield className="w-4 h-4 text-[var(--color-brand-red)]" />
              <span className="hidden sm:block text-xs font-mono font-semibold text-[var(--color-brand-red)] tracking-wider">DH</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-red)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-red)]" />
              </span>
            </button>

            <Link href="/dashboard" className="hidden sm:flex btn btn-primary text-sm px-4 py-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <button
              className="lg:hidden btn btn-ghost w-9 h-9 p-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-b border-[var(--border)] bg-[var(--bg-base)]/98 backdrop-blur-xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        pathname === link.href
                          ? 'bg-[var(--color-brand-blue-muted)] text-[var(--text-primary)] border border-[var(--color-brand-blue-border)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 pb-1 flex flex-col gap-2">
                  <button
                    onClick={() => { setDhOpen(true); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-brand-red-muted)] text-[var(--color-brand-red)] text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" /> Demon Hunters
                  </button>
                  <Link href="/dashboard" className="btn btn-primary justify-center py-2.5">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <DHOverlay open={dhOpen} onClose={() => setDhOpen(false)} />
    </>
  )
}