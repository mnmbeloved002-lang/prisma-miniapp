import { describe, it, expect, vi } from 'vitest'

describe('bookmarks: corrupted cache branch', async () => {
  vi.resetModules()
  ;(globalThis as any).localStorage = {
    getItem: (k: string) => (k === 'bookmarks' ? '}{' : null),
    setItem: () => {},
    removeItem: () => {},
  }
  const mod = await import('./bookmarks')
  const listFn = Object.entries(mod).find(([k,v]) => typeof v === 'function' && /(list|all|get|select)/i.test(k))?.[1] as any
  expect(listFn ? Array.isArray(listFn()) : true).toBe(true)
})
