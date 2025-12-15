import type React from 'react';
import type { GameState } from '../data/gameEngine';

interface DebugProps {
  gameState: GameState | null;
  onRestart: () => void;
}

export const CityMysteryDebugBoard: React.FC<DebugProps> = ({ gameState, onRestart }) => {
  if (!gameState) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-black text-green-400 font-mono text-xs rounded border border-green-800">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">🕵️ DEBUG CONSOLE</h3>
        <button
          onClick={onRestart}
          className="px-2 py-1 bg-green-900 hover:bg-green-700 text-white rounded"
        >
          RESTART GAME
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            Game ID: <span className="text-white">{gameState.gameId}</span>
          </p>
          <p>
            Round: <span className="text-white">{gameState.round}</span>
          </p>
          <p>
            Detective Pos: <span className="text-white">{gameState.detectivePos}</span>
          </p>
        </div>
        <div className="border-l border-green-800 pl-4">
          <p className="text-red-400 font-bold">SECRET INFO:</p>
          <p>
            Killer ID: <span className="text-white">{gameState.secretIdentity?.killerId}</span>
          </p>
          <p>
            Motive: <span className="text-white">{gameState.secretIdentity?.motiveId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
