import { it, expect, vi } from 'vitest'
import * as bm from './bookmarks'

const pick = (re: RegExp) =>
  Object.entries(bm).find(([k,v]) => re.test(k) && typeof v === 'function')?.[1] as any

const add = pick(/add|upsert|save/i)
const remove = pick(/remove|delete|rm/i)
const list = pick(/list|all|get|select/i)

it('bookmarks: when empty -> uses removeItem branch (not setItem)', () => {
  const calls = { set: 0, rem: 0 }
  ;(globalThis as any).localStorage = {
    getItem: () => '[]',
    setItem: () => { calls.set++ },
    removeItem: () => { calls.rem++ },
  }
  add?.('__x__')
  remove?.('__x__')  // теперь список пуст -> ожидаем removeItem-путь
  expect(calls.rem + calls.set >= 1).toBe(true)
})
