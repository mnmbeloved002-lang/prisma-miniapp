import type React from 'react';
import type { PlayerRole } from '../../data/gameTypes';

interface GameHeaderProps {
  round: number;
  maxRounds: number;
  phase: string;
  playerRole: PlayerRole | null;
}

const PHASE_INFO: Record<string, { icon: string; name: string }> = {
  KILLER: { icon: '🔪', name: 'Фаза убийцы' },
  DETECTIVE: { icon: '🔍', name: 'Фаза детектива' },
  CITY: { icon: '🏙', name: 'Фаза города' },
};

export const GameHeader: React.FC<GameHeaderProps> = ({ round, maxRounds, phase, playerRole }) => {
  const phaseInfo = PHASE_INFO[phase] || { icon: '?', name: phase };
  const isMyTurn =
    (phase === 'KILLER' && playerRole === 'KILLER') ||
    (phase === 'DETECTIVE' && playerRole === 'DETECTIVE');

  return (
    <header className="relative z-20 px-4 py-3 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-red-600 tracking-wider">CITY MYSTERY</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Раунд {round}/{maxRounds}
          </p>
        </div>

        <div
          className={`
          px-3 py-1.5 border rounded
          ${
            isMyTurn
              ? 'border-red-700/60 bg-red-950/30 text-red-400'
              : 'border-zinc-700 bg-zinc-800/50 text-zinc-400'
          }
        `}
        >
          <span className="text-sm mr-1">{phaseInfo.icon}</span>
          <span className="text-xs font-medium uppercase tracking-wider">{phaseInfo.name}</span>
        </div>
      </div>

      {isMyTurn && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 animate-pulse" />
      )}
    </header>
  );
};
