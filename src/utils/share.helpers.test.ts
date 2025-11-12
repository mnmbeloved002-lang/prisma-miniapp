import { describe, it, expect, afterEach } from 'vitest'
import * as share from './share'

const save = { window: (globalThis as any).window }

describe('share helpers (SSR-safe)', () => {
  afterEach(() => { (globalThis as any).window = save.window })

  it('__hrefOrExample(): with window', () => {
    (globalThis as any).window = { location: { href: 'https://app.example.com/current' } }
    expect((share as any).__hrefOrExample()).toBe('https://app.example.com/current')
  })

  it('__hrefOrExample(): without window', () => {
    ;(globalThis as any).window = undefined
    expect((share as any).__hrefOrExample()).toBe('https://example.com')
  })

  it('__hrefOrEmpty(): with window', () => {
    (globalThis as any).window = { location: { href: 'https://app.example.com/current' } }
    expect((share as any).__hrefOrEmpty()).toBe('https://app.example.com/current')
  })

  it('__hrefOrEmpty(): without window', () => {
    ;(globalThis as any).window = undefined
    expect((share as any).__hrefOrEmpty()).toBe('')
  })
})
