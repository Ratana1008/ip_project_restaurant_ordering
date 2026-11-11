import { describe, expect, it } from 'vitest'
import { canCancel, nextStatus } from '@/utils/orderStatus'

describe('nextStatus', () => {
  it('moves pending -> preparing -> ready -> completed', () => {
    expect(nextStatus('pending')).toBe('preparing')
    expect(nextStatus('preparing')).toBe('ready')
    expect(nextStatus('ready')).toBe('completed')
  })

  it('stops at completed and for cancelled orders', () => {
    expect(nextStatus('completed')).toBeNull()
    expect(nextStatus('cancelled')).toBeNull()
  })
})

describe('canCancel', () => {
  it('only allows cancelling a pending order', () => {
    expect(canCancel('pending')).toBe(true)
    expect(canCancel('preparing')).toBe(false)
  })
})
