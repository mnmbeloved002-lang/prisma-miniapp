import React, { useEffect } from "react";

import { useRitualStore } from '../application/ritual-store'

import { Header } from './Header'
import { RitualCard } from './RitualCard'

export default function AppShell() {
  const { ritualItem, error, loading, fetchRitual } = useRitualStore()

  useEffect(() => {
    fetchRitual()
  }, [])

  // Простой вывод ошибки без лишних компонентов
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl text-red-400 mb-4">Ошибка</h2>
        <p className="mb-6">{error}</p>
        <button 
          onClick={() => fetchRitual()}
          className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Header title="Prisma Ritual AI" />
      <main className="container mx-auto px-4 py-12">
        {loading && <div className="text-center text-3xl animate-pulse">Загрузка...</div>}
        {!loading && ritualItem && <RitualCard item={ritualItem} />}
      </main>
      <footer className="text-center py-8 text-sm opacity-70">
        © 2025 Prisma Ritual AI
      </footer>
    </div>
  )
}
