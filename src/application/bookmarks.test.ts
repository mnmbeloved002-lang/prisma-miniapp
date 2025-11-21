import { describe, it, expect, beforeEach } from 'vitest'
import { useBookmarks } from './bookmarks'

describe('Bookmarks Store', () => {
  beforeEach(() => {
    useBookmarks.getState().ids = []
    localStorage.clear()
  })

  it('starts empty', () => {
    expect(useBookmarks.getState().ids).toEqual([])
  })

  it('adds item', () => {
    useBookmarks.getState().add('id-1')
    expect(useBookmarks.getState().ids).toEqual(['id-1'])
    expect(useBookmarks.getState().has('id-1')).toBe(true)
  })

  it('does not add duplicates', () => {
    useBookmarks.getState().add('id-1')
    useBookmarks.getState().add('id-1')
    expect(useBookmarks.getState().ids).toEqual(['id-1'])
  })

  it('removes item', () => {
    useBookmarks.getState().add('id-1')
    useBookmarks.getState().remove('id-1')
    expect(useBookmarks.getState().ids).toEqual([])
    expect(useBookmarks.getState().has('id-1')).toBe(false)
  })
  
  it('removes non-existent item safely', () => {
    useBookmarks.getState().add('id-1')
    useBookmarks.getState().remove('id-2')
    expect(useBookmarks.getState().ids).toEqual(['id-1'])
  })

  it('persists to storage', () => {
    useBookmarks.getState().add('persistent')
    // Проверяем, что метод был вызван (так как мы замокали его глобально через vi.fn)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'bookmarks-storage', 
      expect.stringContaining('persistent')
    )
  })
})
