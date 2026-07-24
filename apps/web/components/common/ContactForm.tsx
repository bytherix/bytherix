'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  type: z.enum(['general', 'course', 'project', 'quote'], {
    errorMap: () => ({ message: 'Please select a valid inquiry type' }),
  }),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject must not exceed 150 characters'),
  message: z
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
})
 export type ContactFormData = z.infer<typeof contactFormSchema>
const INQUIRY_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'course', label: 'Course Enrollment' },
  { value: 'project', label: 'Project Request' },
  { value: 'quote', label: 'Request a Quote' },
]
/**
 * Placeholder for future backend API integration.
 * In the future, replace the simulated delay with:
 * `await apiClient.post('/contact', data)`
 */
async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message?: string }> {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1200))
  // For testing error state handling, you can conditionally throw here.
  // In production, real HTTP errors will be caught in the form submit handler.
  return { success: true }
}
interface ContactFormProps {
  onSuccess?: () => void
  className?: string
}
export function ContactForm({ onSuccess, className }: ContactFormProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      type: 'general',
      subject: '',
      message: '',
    },
  })
 const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null)
    try {
      const response = await submitContactForm(data)
      if (response.success) {
        setIsSuccess(true)
        if (onSuccess) onSuccess()
      } else {
        setSubmitError(response.message || 'Failed to send message. Please try again.')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setSubmitError(errorMessage)
    }
  }
  const handleReset = () => {
    setIsSuccess(false)
    setSubmitError(null)
    reset()
  }
       // ── Success State View ───
  if (isSuccess) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl bg-gray-900/50 border border-indigo-500/20 backdrop-blur-sm animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Thank you for reaching out. A team member will review your message and get back to you within 24 hours.
        </p>
        <Button variant="secondary" size="md" onClick={handleReset} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Send Another Message
        </Button>
      </div>
    )
  }
   // ── Form View ──
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={className || 'space-y-5'}>
      {submitError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200 mb-0.5">Submission Error</p>
            <p className="text-xs text-red-300/90">{submitError}</p>
          </div>
        </div>
      )}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Your Name"
          placeholder="John Doe"
          disabled={isSubmitting}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Select
        label="Inquiry Type"
        options={INQUIRY_OPTIONS}
disabled={isSubmitting}
        error={errors.type?.message}
        {...register('type')}
      />
      <Input
        label="Subject"
        placeholder="How can we help you?"
        disabled={isSubmitting}
        error={errors.subject?.message}
        {...register('subject')}
      />
      <Textarea
        label="Message"
        rows={5}
        placeholder="Tell us about your project or questions..."
        disabled={isSubmitting}
        error={errors.message?.message}
        {...register('message')}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full justify-center text-sm font-semibold py-3 shadow-lg shadow-indigo-500/15"
      >
        {!isSubmitting && <Send className="w-4 h-4" />}
        {isSubmitting ? 'Sending Message...' : 'Send Message'}
      </Button>
    </form>
  )
}
