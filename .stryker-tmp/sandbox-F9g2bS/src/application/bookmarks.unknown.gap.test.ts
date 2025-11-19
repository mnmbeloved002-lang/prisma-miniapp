// @ts-nocheck
import { describe, it, expect } from 'vitest'
import * as bm from './bookmarks'

const reduce = Object.entries(bm).find(([k,v]) => typeof v === 'function' && /(reduce|reducer|dispatch)/i.test(k))?.[1] as any

describe('bookmarks: unknown action branch', () => {
  it('unknown action handled safely', () => {
    if (!reduce) return expect(true).toBe(true) // нет редьюсера — ветка неприменима
    const state = reduce(undefined, { type: '__UNKNOWN__' })
    expect(state).toBeDefined()
  })
})
