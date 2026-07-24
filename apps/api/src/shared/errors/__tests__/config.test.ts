import { describe, it, expect } from 'vitest'

describe('Environment config', () => {
  it('NODE_ENV is set', () => {
    expect(process.env['NODE_ENV']).toBeDefined()
  })

  it('has valid NODE_ENV value', () => {
    const valid = ['development', 'production', 'test']
    expect(valid).toContain(process.env['NODE_ENV'])
  })
})