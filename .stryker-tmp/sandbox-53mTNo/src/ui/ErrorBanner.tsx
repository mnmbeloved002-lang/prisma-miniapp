// @ts-nocheck
import { useState, useEffect, useRef, lazy, Suspense, memo } from "react";

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="bg-red-500/10 text-red-200 border border-red-400/20 rounded-xl mx-4 my-3 p-3 flex items-center justify-between"
      role="alert" // <-- ИСПРАВЛЕНИЕ ЗДЕСЬ
    >
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/15"
      >
        Повторить
      </button>
    </div>
  );
}
