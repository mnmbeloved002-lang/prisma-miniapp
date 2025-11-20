import React from 'react'
import { useBookmarks } from '../application/bookmarks'
import type { Ritual } from '../domain/ritual'

interface Props {
  item: Ritual
}

export function RitualCard({ item }: Props) {
  const { has, add, remove } = useBookmarks()
  const isBookmarked = has(item.id)

  const toggleBookmark = () => {
    if (isBookmarked) {
      remove(item.id)
    } else {
      add(item.id)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto text-center shadow-2xl border border-white/10">
      <h1 className="text-4xl font-bold mb-6">{item.title}</h1>
      
      <div className="mb-8 p-6 bg-white/5 rounded-2xl">
        <p className="text-2xl font-light italic leading-relaxed opacity-90">
          "{item.motivation}"
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm uppercase tracking-widest opacity-50 mb-2">Твоя задача</h3>
          <p className="text-xl font-medium">{item.task}</p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest opacity-50 mb-2">Аффирмация</h3>
          <p className="text-xl font-medium text-purple-200">{item.affirmation}</p>
        </div>
      </div>

      <button 
        onClick={toggleBookmark}
        className="mt-10 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition text-sm font-semibold tracking-wide"
      >
        {isBookmarked ? '★ В избранном' : '☆ В избранное'}
      </button>
    </div>
  )
}
