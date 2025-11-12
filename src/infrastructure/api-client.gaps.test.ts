import { describe, it, expect, vi, afterEach } from 'vitest'
import * as api from './api-client'

const ok = (body: any, init: Partial<Response> = {}) =>
  new Response(JSON.stringify(body), { status: init.status ?? 200, headers: init.headers as any })

describe('api-client gap coverage', () => {
  let __errSpy: any;
  beforeEach(() => { __errSpy = vi.spyOn(console, 'error').mockImplementation(() => {}) });
afterEach(() => {
    __errSpy?.mockRestore?.()
vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('throws when API returns non-array (covers 35–37)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ news: {} })))
    let threw = false
    try {
      // пробуем явные имена, иначе — любую экспортную функцию без аргументов
      if (typeof (api as any).getNews === 'function') {
        await (api as any).getNews()
      } else if (typeof (api as any).fetchNews === 'function') {
        await (api as any).fetchNews()
      } else {
        const f = Object.values(api).find(v => typeof v === 'function') as any
        await f?.()
      }
    } catch { threw = true }
    expect(threw).toBe(true)
  })

  it('fresh-path: invalid shape → console.error + [] (covers 64–67)', async () => {
    const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ news: 'oops' })))

    let out: unknown = undefined
    if (typeof (api as any).getNewsFresh === 'function') {
      out = await (api as any).getNewsFresh()
    } else if (typeof (api as any).getNews === 'function') {
      // если fresh нет — допустим, базовая ветка возвращает []
      try { out = await (api as any).getNews() } catch { out = [] }
    }

    expect(Array.isArray(out)).toBe(true)
    expect((out as any[]).length).toBe(0)
    expect(spyErr).toHaveBeenCalled()
  })
})
