import { describe, expect, it } from 'vitest'
import { validateLogin } from '@/utils/validation'

describe('validateLogin', () => {
  it('accepts a valid email and a password of 8 characters', () => {
    expect(validateLogin('sokha@example.com', '12345678')).toEqual({})
  })

  it('asks for both fields when empty', () => {
    const errors = validateLogin('', '')
    expect(errors.email).toBe('Email is required.')
    expect(errors.password).toBe('Password is required.')
  })

  it('rejects a bad email and a short password', () => {
    const errors = validateLogin('not-an-email', '1234567')
    expect(errors.email).toContain('valid email')
    expect(errors.password).toContain('at least 8')
  })
})
