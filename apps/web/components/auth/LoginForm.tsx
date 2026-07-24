'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type F = z.infer<typeof schema>

export function LoginForm() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPw, setShowPw] = useState(false)
  const [err, setErr]       = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    setErr('')
    try {
      const res = await apiClient.post<{ data: { accessToken: string; user: never } }>('/auth/login', data)
      setAuth(res.data.data.user, res.data.data.accessToken)
      router.push('/dashboard')
    } catch { setErr('Invalid email or password') }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {err && <div role="alert" className="rounded-xl border border-bx-red/30 bg-bx-red/10 px-4 py-3 text-bx-red text-sm">{err}</div>}

      <div>
        <label htmlFor="email" className="block text-bx-slate text-sm font-medium mb-1.5">Email address</label>
        <input id="email" type="email" autoComplete="email" {...register('email')}
          className="w-full px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors"
          placeholder="you@example.com" />
        {errors.email && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="text-bx-slate text-sm font-medium">Password</label>
          <Link href="/forgot-password" className="text-xs text-bx-blue hover:text-bx-blue-light transition-colors">Forgot password?</Link>
        </div>
        <div className="relative">
          <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" {...register('password')}
            className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors"
            placeholder="••••••••" />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bx-muted hover:text-bx-slate" aria-label="Toggle password">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="text-center text-bx-slate text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-bx-blue hover:text-bx-blue-light font-medium transition-colors">Create one free</Link>
      </p>
    </form>
  )
}