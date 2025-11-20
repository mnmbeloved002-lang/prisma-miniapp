import React, { useEffect } from "react";
import { Header } from './Header'
import { RitualCard } from './RitualCard'
import { useRitualStore } from '../application/ritual-store'

export default function AppShell() {
  const { ritualItem, error, loading, fetchRitual } = useRitualStore()

  useEffect(() => {
    fetchRitual()
  }, [])

  if (loading) return <div className="text-center text-3xl p-10">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Header title="Prisma Ritual AI" />
      <main className="container mx-auto px-4 py-12">
        {ritualItem && <RitualCard item={ritualItem} />}
      </main>
      <footer className="text-center py-8 text-sm opacity-70">
        © 2025 Prisma Ritual AI
      </footer>
    </div>
  )
}
