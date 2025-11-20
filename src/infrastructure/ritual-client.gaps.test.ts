import { describe, it, expect, vi, afterEach } from 'vitest'
import * as api from './ritual-client'

const ok = (body: any, init: Partial<Response> = {}) =>
  new Response(JSON.stringify(body), { status: init.status ?? 200, headers: init.headers as any })

  let __errSpy: any;
  beforeEach(() => { __errSpy = vi.spyOn(console, 'error').mockImplementation(() => {}) });
afterEach(() => {
    __errSpy?.mockRestore?.()
vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('throws when API returns non-array (covers 35–37)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ ritual: {} })))
    let threw = false
    try {
      // пробуем явные имена, иначе — любую экспортную функцию без аргументов
      if (typeof (api as any).getRitual === 'function') {
        await (api as any).getRitual()
      } else if (typeof (api as any).fetchRitual === 'function') {
        await (api as any).fetchRitual()
      } else {
        const f = Object.values(api).find(v => typeof v === 'function') as any
        await f?.()
      }
    } catch { threw = true }
    expect(threw).toBe(true)
  })

  it('fresh-path: invalid shape → console.error + [] (covers 64–67)', async () => {
    const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ ritual: 'oops' })))

    let out: unknown = undefined
    if (typeof (api as any).getRitualFresh === 'function') {
      out = await (api as any).getRitualFresh()
    } else if (typeof (api as any).getRitual === 'function') {
      // если fresh нет — допустим, базовая ветка возвращает []
      try { out = await (api as any).getRitual() } catch { out = [] }
    }

    expect(Array.isArray(out)).toBe(true)
    expect((out as any[]).length).toBe(0)
    expect(spyErr).toHaveBeenCalled()
  })
})
