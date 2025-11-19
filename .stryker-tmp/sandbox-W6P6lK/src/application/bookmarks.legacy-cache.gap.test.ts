// @ts-nocheck
import { it, expect, vi } from 'vitest'

it('bookmarks: legacy cache shape -> migrates to array safely', async () => {
  vi.resetModules()
  ;(globalThis as any).localStorage = {
    // подстрой под свою "старую" схему, если отличается
    getItem: () => JSON.stringify({ items: ['legacy-id'] }),
    setItem: () => {},
    removeItem: () => {},
  }
  const mod = await import('./bookmarks')
  const list = Object.values(mod).find(v => typeof v === 'function' && /list|all|get|select/i.test((v as any).name || 'list')) as any
  const arr = list?.()
  expect(Array.isArray(arr)).toBe(true)})
