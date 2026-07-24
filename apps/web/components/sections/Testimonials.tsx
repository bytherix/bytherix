'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Aarav Sharma',    role: 'Full Stack Developer',  company: 'Softwarica',
    text: 'Bytherix completely transformed my career. The Full Stack bootcamp was incredibly practical — I got a job offer before even finishing the course.',
    rating: 5, initials: 'AS', color: '#1452CC',
  },
  {
    name: 'Priya Thapa',     role: 'Security Analyst',      company: 'Freelance',
    text: 'The Ethical Hacking course here is genuinely industry-level. The instructors have real-world VAPT experience, and it shows in every module.',
    rating: 5, initials: 'PT', color: '#DC2626',
  },
  {
    name: 'Rajan Shrestha',  role: 'AI Engineer',           company: 'NIC Asia Bank',
    text: 'Best investment I made. The ML course gave me a strong foundation and the project support helped me build a portfolio that impressed employers.',
    rating: 5, initials: 'RS', color: '#16A34A',
  },
  {
    name: 'Sita Basnet',     role: 'Mobile Developer',      company: 'CloudFactory',
    text: 'The App Development track is comprehensive and up to date. React Native, Flutter, native Android — all covered with real-world projects.',
    rating: 5, initials: 'SB', color: '#0EA5E9',
  },
  {
    name: 'Deepak Rai',      role: 'DevOps Engineer',       company: 'Leapfrog Technology',
    text: 'Cloud & DevOps training at Bytherix is top-notch. Got hands-on with AWS, Docker, Kubernetes, and CI/CD pipelines from day one.',
    rating: 5, initials: 'DR', color: '#F59E0B',
  },
  {
    name: 'Anjali Gurung',   role: 'Game Developer',        company: 'Indie Studio',
    text: 'As someone who wanted to make games for years, this was the push I needed. Great instructors, great community, and actual shipped games.',
    rating: 5, initials: 'AG', color: '#9333EA',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 relative" aria-labelledby="testimonials-heading" style={{ backgroundColor: '#050D1A' }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: '#F59E0B' }}
          >
            Student Stories
          </motion.p>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text-primary)]"
          >
            Real Results, Real People
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="max-w-lg mx-auto text-[var(--text-secondary)]"
          >
            Join thousands of students who built careers and businesses with Bytherix.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="card rounded-2xl p-6 flex flex-col"
            >
              <Quote className="w-7 h-7 mb-4 opacity-20" style={{ color: t.color }} />

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                ))}
              </div>

              <blockquote className="text-sm leading-relaxed flex-1 mb-5" style={{ color: '#8B9DC3' }}>
                &quot;{t.text}&quot;
              </blockquote>

              <figcaption className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${t.color}25`, border: `1px solid ${t.color}40`, color: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{t.role} · {t.company}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}