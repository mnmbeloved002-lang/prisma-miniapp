import type React from 'react';
import type { PlayerRole } from '../../data/gameTypes';

interface ActionBarProps {
  phase: string;
  playerRole: PlayerRole | null;
  actionsLeft: number;
}

export const ActionBar: React.FC<ActionBarProps> = ({ phase, playerRole, actionsLeft }) => {
  const isMyTurn =
    (phase === 'KILLER' && playerRole === 'KILLER') ||
    (phase === 'DETECTIVE' && playerRole === 'DETECTIVE');

  return (
    <div className="relative z-20 px-4 py-3 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="text-xs text-zinc-500">
          {isMyTurn ? (
            <>
              <span className="text-zinc-400">Действий: </span>
              <span className="text-red-400 font-bold">{actionsLeft}</span>
            </>
          ) : (
            <span>Ожидание хода...</span>
          )}
        </div>

        {isMyTurn && (
          <button
            type="button"
            className="px-4 py-2 text-xs uppercase tracking-wider border border-red-700/60 text-red-400 hover:bg-red-950/30 transition-all"
          >
            Завершить ход
          </button>
        )}
      </div>
    </div>
  );
};
