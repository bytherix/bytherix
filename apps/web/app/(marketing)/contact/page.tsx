import type { Metadata } from 'next'
import { ContactForm } from '@/components/common/ContactForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Bytherix for courses, project quotes, or support.',
  alternates: { canonical: 'https://bytherix.com/contact' },
}

const contactInfo = [
  { icon: Mail,   label: 'Email',   value: 'hello@bytherix.com', href: 'mailto:hello@bytherix.com' },
  { icon: Phone,  label: 'Phone',   value: '+977 980-000-0000',  href: 'tel:+9779800000000' },
  { icon: MapPin, label: 'Address', value: 'Kathmandu, Nepal',   href: null },
  { icon: Clock,  label: 'Hours',   value: 'Mon–Sat, 9am–6pm',  href: null },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-[calc(var(--nav-height)+3rem)] pb-20 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-14">
          <p className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-[0.25em] mb-3">
            Get In Touch
          </p>
          <h1 id="contact-heading" className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Let&apos;s build something great
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            Have a project in mind, need custom development, or want to enroll in a course? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left Column: Info Cards */}
          <ul className="lg:col-span-2 space-y-4" aria-label="Contact information">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <li
                key={label}
                className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700/80 flex items-start gap-4 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                {/* min-w-0 lets long unbreakable strings (like the email)
                    wrap/break instead of forcing the flex item — and the
                    whole page — to overflow horizontally on narrow screens. */}
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  {href ? (
                    <a  
                      href={href}
                      className="text-white text-sm font-semibold hover:text-indigo-300 transition-colors break-words"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-white text-sm font-semibold break-words">
                      {value}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Right Column: Contact Form */}
          <section
            aria-labelledby="contact-form-heading"
            className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-gray-900/60 border border-gray-800/80 backdrop-blur-sm shadow-xl"
          >
            <h2 id="contact-form-heading" className="text-xl font-bold text-white mb-6">
              Send us a message
            </h2>
            <ContactForm />
          </section>
        </div>
      </div>
    </main>
  )
}