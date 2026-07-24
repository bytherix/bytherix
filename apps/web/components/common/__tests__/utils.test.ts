import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, slugify } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges conflicting tailwind classes correctly', () => {
    // tailwind-merge should pick the last one
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('slugify', () => {
  it('converts spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('handles multiple spaces', () => {
    expect(slugify('web  development')).toBe('web-development')
  })
})

describe('formatCurrency', () => {
  it('formats INR correctly', () => {
    const result = formatCurrency(499, 'INR')
    expect(result).toContain('499')
  })
})