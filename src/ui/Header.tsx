import React from "react";

interface HeaderProps {
  title?: string
}

export function Header({ title = "Prisma Ritual AI" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-lg bg-bg/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 text-center">
        <h1 className="text-3xl font-bold tracking-wider">{title}</h1>
      </div>
    </header>
  )
}
