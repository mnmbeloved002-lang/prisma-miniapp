import React from 'react';

interface SetupLayoutProps {
  currentPhase: string;
  totalPhases: number;
  currentPhaseIndex: number;
  title: string;
  error?: string | null;
  children: React.ReactNode;
}

export const SetupLayout: React.FC<SetupLayoutProps> = ({
  currentPhaseIndex,
  totalPhases,
  title,
  error,
  children,
}) => {
  return (
    // fixed inset-0 z-50 перекрывает глобальный хедер "MiniAPP"
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-200 font-mono flex flex-col overflow-y-auto">
      
      {/* --- ХЕДЕР: Досье --- */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Настройка протокола
            </h2>
            <span className="text-xs text-red-600 font-bold">
              ШАГ {currentPhaseIndex + 1} / {totalPhases}
            </span>
          </div>
          
          {/* Прогресс-бар */}
          <div className="h-1 w-full bg-zinc-800 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-red-700 transition-all duration-500 ease-out"
              style={{ width: `${((currentPhaseIndex + 1) / totalPhases) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full relative">
        
        {/* Заголовок этапа */}
        <div className="py-6 text-center animate-fade-in">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
            {title}
          </h1>
          <div className="h-0.5 w-12 bg-zinc-800 mx-auto" />
        </div>

        {/* Блок ошибки */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 text-red-200 text-sm flex gap-3 items-start animate-shake rounded-sm">
            <span className="text-lg">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Внедренный контент шага */}
        <div className="flex-1">
          {children}
        </div>

      </main>

      {/* --- ФУТЕР --- */}
      <footer className="p-4 text-center border-t border-zinc-900 mt-auto">
        <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-bold">
          Prisma MiniAPP // v 1.0
        </p>
      </footer>
    </div>
  );
};
