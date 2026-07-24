'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Briefcase } from 'lucide-react'

const _floatingChips = [
  { label: '500+ students', emoji: '🎓', delay: 0,   x: '-left-10',  y: '-top-6' },
  { label: 'Certified courses', emoji: '✅', delay: 0.4, x: '-right-8', y: '-top-4' },
  { label: '95% hired', emoji: '💼', delay: 0.8, x: '-right-12', y: 'bottom-8' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 circuit-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 60% 0%, rgba(37,99,235,0.12), transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-[var(--color-brand-blue-border)] bg-[var(--color-brand-blue-muted)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-green)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wide">
              Now enrolling — Spring 2025 batch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            {/* Varied line weights and colors — not just three equal words */}
            <span className="text-[var(--text-primary)]">We teach you</span>
            <br />
            <span className="text-gradient-blue">to build</span>
            {' '}
            <span className="text-[var(--text-secondary)] font-light text-5xl xl:text-6xl">things</span>
            <br />
            <span className="text-[var(--text-primary)]">that </span>
            <span className="text-gradient-green">matter.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 max-w-md"
          >
            Bytherix is where developers, hackers, and builders are made — through
            real courses, live projects, and mentorship from people who&apos;ve actually shipped things.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <Link href="/training" className="btn btn-primary text-sm px-5 py-3">
              <BookOpen className="w-4 h-4" />
              Browse Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="btn btn-secondary text-sm px-5 py-3">
              <Briefcase className="w-4 h-4" />
              Hire Us
            </Link>
          </motion.div>

          {/* Social proof — concrete, not generic */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6"
          >
            {[
              { num: '500+', label: 'students trained' },
              { num: '95%',  label: 'employment rate' },
              { num: '50+',  label: 'projects shipped' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-xl font-black text-[var(--text-primary)]">{num}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — logo with personality */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Ambient glow behind logo */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20 animate-float-slow pointer-events-none"
              style={{ background: 'radial-gradient(circle, #2563EB 0%, #16A34A 50%, #DC2626 100%)' }}
              aria-hidden="true"
            />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <Image
                src="/logo.jpg"
                alt="Bytherix — Tech Education & Digital Solutions"
                width={360}
                height={360}
                className="drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Floating chips — positioned around the logo, varied */}
            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -left-8 card px-3 py-2 flex items-center gap-2 shadow-lg"
            >
              <span className="text-base">🎓</span>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] leading-none">500+ Students</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">and counting</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0], x: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-2 -right-6 card px-3 py-2 flex items-center gap-2 shadow-lg"
            >
              <span className="text-base">🔐</span>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] leading-none">Ethical Hacking</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">industry certified</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1/3 -right-14 card px-3 py-2 flex items-center gap-2 shadow-lg"
            >
              <span className="text-base">⚡</span>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] leading-none">Live Projects</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">real clients</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}