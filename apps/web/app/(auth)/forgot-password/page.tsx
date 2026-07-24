import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = { title: 'Forgot Password', robots: { index: false, follow: false } }

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-bx-white mb-2">Reset your password</h1>
        <p className="text-bx-slate text-sm">Enter your email and we&apos;ll send a reset link</p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}