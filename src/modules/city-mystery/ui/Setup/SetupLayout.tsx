import type React from 'react';

interface SetupLayoutProps {
  currentPhase: string;
  totalPhases: number;
  currentPhaseIndex: number;
  title: string;
  error?: string | null;
  children: React.ReactNode;
}

const PHASE_IDS = [
  'mode',
  'role',
  'motives',
  'citizens',
  'buildings',
  'detective',
  'killer',
  'motive',
  'ready',
];

function getProgressStatus(index: number, current: number): 'done' | 'current' | 'pending' {
  if (index < current) {
    return 'done';
  }
  if (index === current) {
    return 'current';
  }
  return 'pending';
}

function getProgressClass(status: 'done' | 'current' | 'pending'): string {
  const classes = {
    done: 'bg-red-700',
    current: 'bg-red-500 animate-pulse',
    pending: 'bg-zinc-800',
  };
  return classes[status];
}

export const SetupLayout: React.FC<SetupLayoutProps> = ({
  currentPhaseIndex,
  totalPhases,
  title,
  error,
  children,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black text-zinc-200 flex flex-col overflow-hidden"
      style={{ height: '100dvh', touchAction: 'pan-y' }}
    >
      {/* Фоновая текстура */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Виньетка */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)] z-0" />

      {/* Стили */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* HEADER */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-black/60 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-5 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
                Протокол
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono tracking-wider">
              <span className="text-red-500">{currentPhaseIndex + 1}</span>
              <span className="text-zinc-600 mx-1">/</span>
              <span>{totalPhases}</span>
            </span>
          </div>

          {/* Прогресс */}
          <div className="flex gap-1.5">
            {PHASE_IDS.slice(0, totalPhases).map((phaseId, idx) => {
              const status = getProgressStatus(idx, currentPhaseIndex);
              return (
                <div
                  key={phaseId}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${getProgressClass(status)}`}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-md mx-auto w-full px-5 py-6 flex-1 flex flex-col">
          <div className="mb-6 text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 uppercase tracking-wide mb-2">
              {title}
            </h1>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-700/60 to-transparent mx-auto" />
          </div>

          {error && (
            <div
              className="mb-5 p-3 bg-red-950/20 border border-red-900/40 text-red-300 text-sm flex gap-3 items-start rounded"
              style={{ animation: 'slideIn 0.3s ease-out' }}
            >
              <span className="text-base">⚠</span>
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <div className="flex-1" style={{ animation: 'fadeIn 0.4s ease-out 0.1s both' }}>
            {children}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-3 text-center border-t border-zinc-900/50">
        <p className="text-[9px] text-zinc-700 uppercase tracking-[0.3em]">
          City Mystery • Настройка
        </p>
      </footer>
    </div>
  );
};
