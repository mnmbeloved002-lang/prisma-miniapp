import React, { Suspense } from "react";

import { Header } from './Header'
import { ErrorBanner } from './ErrorBanner'
import { RitualCard } from '../modules/ritual/RitualCard'
import { useRitualStore } from '../application/ritual-store'

export default function AppShell() {
  const { ritual, error, loading } = useRitualStore()

  if (error) {
    return <ErrorBanner message={error} onRetry={() => useRitualStore.getState().fetchRitual()} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Header title="Prisma Ritual AI" />

      <main className="container mx-auto px-4 py-12">
        <Suspense fallback={<div className="text-center text-4xl animate-pulse">Загрузка ритуала...</div>}>
          {loading ? <div className="text-center text-3xl">Загрузка...</div> : ritual && <RitualCard ritual={ritual} />}
        </Suspense>
      </main>

      <footer className="text-center py-8 text-sm opacity-70">
        © 2025 Prisma Ritual AI — твой ежедневный ритуал души
      </footer>
    </div>
  )
}
