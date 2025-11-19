import React from "react";

import { useState, useEffect, useRef, lazy, Suspense, memo } from "react";

// src/ui/NewItemsBar.tsx
interface Props {
  count: number
  onShow: () => void
}

export default function NewItemsBar({ count, onShow }: Props) {
  if (!count) return null
  return (
    <div className="sticky top-[56px] z-20">
      <div className="container mx-auto px-4">
        <button
          onClick={onShow}
          className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 py-2 text-sm"
        >
          Показать новые: {count}
        </button>
      </div>
    </div>
  )
}
