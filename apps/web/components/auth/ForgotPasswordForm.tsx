'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const schema = z.object({ email: z.string().email('Enter a valid email') })
type F = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [ok, setOk]   = useState(false)
  const [err, setErr] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    setErr('')
    try { await apiClient.post('/auth/forgot-password', data); setOk(true) }
    catch { setErr('Something went wrong. Please try again.') }
  }

  if (ok) return (
    <div className="text-center py-8">
      <CheckCircle className="w-14 h-14 text-bx-green mx-auto mb-4" />
      <h2 className="text-xl font-bold text-bx-white mb-2">Email sent!</h2>
      <p className="text-bx-slate text-sm mb-6">If that email exists, you&apos;ll receive a reset link shortly.</p>
      <Link href="/login" className="text-bx-blue text-sm font-medium hover:text-bx-blue-light">← Back to sign in</Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {err && <div role="alert" className="rounded-xl border border-bx-red/30 bg-bx-red/10 px-4 py-3 text-bx-red text-sm">{err}</div>}
      <div>
        <label htmlFor="fp-email" className="block text-bx-slate text-sm font-medium mb-1.5">Email address</label>
        <input id="fp-email" type="email" autoComplete="email" {...register('email')}
          className="w-full px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors"
          placeholder="you@example.com" />
        {errors.email && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </button>
      <div className="text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-bx-slate text-sm hover:text-bx-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
      </div>
    </form>
  )
}