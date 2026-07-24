import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = { title: 'Reset Password', robots: { index: false, follow: false } }

type Props = { searchParams: Promise<{ token?: string }> }

async function ResetPasswordFormLoader({ searchParams }: Props) {
  const { token } = await searchParams
  return <ResetPasswordForm token={token ?? ''} />
}

export default function ResetPasswordPage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-bx-white mb-2">Set new password</h1>
        <p className="text-bx-slate text-sm">Choose a strong password</p>
      </div>
      <Suspense fallback={null}>
        <ResetPasswordFormLoader searchParams={searchParams} />
      </Suspense>
    </div>
  )
}