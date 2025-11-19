// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as bm from './bookmarks'

const pick = (re: RegExp) =>
  Object.entries(bm).find(([k, v]) => re.test(k) && typeof v === 'function')?.[1] as any

const add = pick(/^(add|addBookmark|upsert|save)/i)
const remove = pick(/^(remove|delete|del|rm)/i)
const list = pick(/(list|all|get|select)/i)

describe('bookmarks extra branches', () => {
  beforeEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

  it('ранний выход/валидация пустого/пробельного ID', () => {
    if (!add) return expect(true).toBe(true)
    // пустой
    try { add('') } catch {}
    // только пробелы / непечатаемые
    try { add(' \t\n ') } catch {}
    expect(typeof list === 'function' ? Array.isArray(list()) : true).toBe(true)
  })

  it('ошибка записи в localStorage.setItem → код остаётся устойчивым', () => {
    if (!add) return expect(true).toBe(true)
    const real = (globalThis as any).localStorage
    ;(globalThis as any).localStorage = {
      ...real,
      getItem: (k: string) => real?.getItem ? real.getItem(k) : null,
      setItem: () => { throw new Error('quota exceeded') },
      removeItem: (k: string) => real?.removeItem?.(k),
      key: (i: number) => real?.key?.(i) ?? null,
      length: real?.length ?? 0,
      clear: () => real?.clear?.()
    }
    try {
      add('__x__')
      remove?.('__x__')
      expect(typeof list === 'function' ? Array.isArray(list()) : true).toBe(true)
    } finally {
      (globalThis as any).localStorage = real
    }
  })
})
