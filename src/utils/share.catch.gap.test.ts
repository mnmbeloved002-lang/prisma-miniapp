import { it, expect, vi, afterEach } from 'vitest'
import * as share from './share'

const saveWin = (globalThis as any).window

afterEach(() => {
  ;(globalThis as any).window = saveWin
  vi.unstubAllGlobals()
})

// заставляем доступ к window.location бросать → попадаем в catch
it('__hrefOrExample(): catch branch', () => {
  vi.stubGlobal('window', new Proxy({}, { get(){ throw new Error('boom') } }))
  expect((share as any).__hrefOrExample()).toBe('https://example.com')
})

it('__hrefOrEmpty(): catch branch', () => {
  vi.stubGlobal('window', new Proxy({}, { get(){ throw new Error('boom') } }))
  expect((share as any).__hrefOrEmpty()).toBe('')
})
