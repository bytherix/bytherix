'use client'

import Link from 'next/link'

const footerLinks = {
  Academy: [
    { label: 'All Courses',   href: '/training' },
    { label: 'Certifications',href: '/training/certifications' },
    { label: 'Live Projects', href: '/projects' },
    { label: 'Mentorship',    href: '/training/mentorship' },
  ],
  Services: [
    { label: 'Software Development', href: '/services/web-development' },
    { label: 'Mobile Apps',          href: '/services/app-development' },
    { label: 'Game Development',     href: '/services/game-development' },
    { label: 'AI Solutions',         href: '/services/ai-automation' },
  ],
  Solutions: [
    { label: 'IoT & Robotics',    href: '/services/robotics' },
    { label: 'PCB Design',        href: '/services/pcb-design' },
    { label: 'Graphic Design',    href: '/services/graphic-design' },
    { label: 'Digital Marketing', href: '/services/digital-marketing' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers',  href: '/careers' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Contact',  href: '/contact' },
  ],
}

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/bytherix',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@bytherix',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="#0D1A2E" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@bytherix',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer
      style={{ backgroundColor: '#0b0f1a', borderTop: '1px solid #1a2236' }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Single unified grid: Brand + all 4 link columns ── */}
        <div className="pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-3xl font-black tracking-widest uppercase"
                style={{ color: '#1452CC' }}
              >
                BYTHERIX
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: '#8B9DC3' }}
            >
              Transforming ideas into innovation through cutting-edge
              education and technology solutions.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: '#8B9DC3',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(20,82,204,0.2)'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'
                  }}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* All four link columns rendered in the SAME grid — no filtering, no nesting */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className="text-sm font-bold mb-4 tracking-wide"
                style={{ color: '#F8FAFF' }}
              >
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: '#8B9DC3' }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = '#1452CC')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3')
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid #1a2236' }}
        >
          <p className="text-xs" style={{ color: '#4A5A7A' }}>
            © 2024 Bytherix. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase().replace(/ /g, '-')}`}
                className="text-xs transition-colors duration-150"
                style={{ color: '#4A5A7A' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = '#4A5A7A')
                }
              >
                {text}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}