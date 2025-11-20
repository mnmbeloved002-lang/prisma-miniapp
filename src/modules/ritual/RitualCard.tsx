import React from "react";

interface Ritual {
  title: string
  motivation: string
  task: string
  affirmation: string
}

export function RitualCard({ ritual }: { ritual: Ritual }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-2xl mx-auto text-center shadow-2xl">
      <h1 className="text-5xl font-bold mb-8">{ritual.title}</h1>
      <p className="text-3xl mb-10 leading-relaxed">{ritual.motivation}</p>
      <p className="text-2xl mb-12">Задача на день: <strong>{ritual.task}</strong></p>
      <p className="text-xl italic opacity-90">{ritual.affirmation}</p>
      <button className="mt-12 px-8 py-4 bg-white/20 rounded-full text-xl hover:bg-white/30 transition">
        Слушать голосом
      </button>
    </div>
  )
}
