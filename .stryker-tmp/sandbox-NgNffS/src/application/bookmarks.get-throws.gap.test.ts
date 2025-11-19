// @ts-nocheck
import { it, expect, vi } from 'vitest'

it('bookmarks: getItem throws -> catch branch keeps state valid', async () => {
  vi.resetModules()
  ;(globalThis as any).localStorage = {
    getItem: () => { throw new Error('read fail') },
    setItem: () => {},
    removeItem: () => {},
  }
  const mod = await import('./bookmarks')
  const list = Object.values(mod).find(v => typeof v === 'function' && /list|all|get|select/i.test((v as any).name || 'list')) as any
  expect(Array.isArray(list?.())).toBe(true)
})
