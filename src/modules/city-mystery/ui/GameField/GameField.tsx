import type React from 'react';
import { useState } from 'react';
import { useGameStore } from '../../application/gameStore';
import { ActionBar } from './ActionBar';
import { CompactGrid } from './CompactGrid';
import { DistrictSheet } from './DistrictSheet';
import { GameHeader } from './GameHeader';

export const GameField: React.FC = () => {
  const { gameState, playerRole, frightenResidents, killResident, moveDetective } = useGameStore();
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [frightenTargets, setFrightenTargets] = useState<string[]>([]);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);

  if (!gameState) {
    return <div className="text-white p-4">Загрузка игры...</div>;
  }

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setActionLog((prev) => [...prev, `[${time}] ${msg}`].slice(-20));
  };

  const handleAction = (action: string, targetId?: string) => {
    console.log(
      'handleAction:',
      action,
      targetId,
      'district:',
      selectedDistrict,
      'step:',
      gameState.step,
    );

    let result;
    switch (action) {
      case 'KILL':
        if (targetId && selectedDistrict !== null) {
          const victim = gameState.grid[selectedDistrict].find((c) => c.id === targetId);
          result = killResident(targetId, selectedDistrict);
          if (result.isValid) {
            addLog(`🔪 Убит: ${victim?.name || victim?.role || 'житель'}`);
            setSelectedDistrict(null);
          } else {
            addLog(`❌ ${result.error}`);
          }
        }
        break;

      case 'FRIGHTEN':
        if (targetId) {
          const target = gameState.grid.flat().find((c) => c.id === targetId);
          const newTargets = frightenTargets.includes(targetId)
            ? frightenTargets.filter((id) => id !== targetId)
            : [...frightenTargets, targetId];

          setFrightenTargets(newTargets);

          if (newTargets.length === 2) {
            result = frightenResidents(newTargets);
            if (result.isValid) {
              const names = newTargets.map((id) => {
                const c = gameState.grid.flat().find((r) => r.id === id);
                return c?.name || c?.role || 'житель';
              });
              addLog(`😨 Запуганы: ${names.join(', ')}`);
              setFrightenTargets([]);
            } else {
              addLog(`❌ ${result.error}`);
              setFrightenTargets([]);
            }
          } else {
            addLog(`😨 Выбран для запугивания: ${target?.name || target?.role}`);
          }
        }
        break;

      case 'MOVE_HERE':
        if (selectedDistrict !== null && playerRole === 'DETECTIVE') {
          result = moveDetective(selectedDistrict);
          if (result.isValid) {
            addLog(
              `🚶 Детектив → квартал [${Math.floor(selectedDistrict / 4)},${selectedDistrict % 4}]`,
            );
            setSelectedDistrict(null);
          } else {
            addLog(`❌ ${result.error}`);
          }
        }
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col" style={{ height: '100dvh' }}>
      {/* Текстура */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <GameHeader
        round={gameState.round}
        maxRounds={gameState.maxRounds}
        phase={gameState.phase}
        playerRole={playerRole}
      />

      {/* Info Bar: подсказки + жертвы */}
      <div className="px-3 py-2 bg-zinc-900/80 border-b border-zinc-800 space-y-1">
        {/* Подсказка */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-zinc-400">
            {gameState.step === 'FRIGHTEN' &&
              frightenTargets.length === 0 &&
              '😨 Выберите 2 жителей для запугивания'}
            {gameState.step === 'FRIGHTEN' &&
              frightenTargets.length === 1 &&
              '😨 Выберите ещё 1 жителя'}
            {gameState.step === 'KILL' && '🔪 Выберите жертву для убийства'}
            {gameState.step === 'MOVE' && '🚶 Выберите квартал для перемещения'}
            {gameState.step === 'INVESTIGATE' && '🔍 Ваш ход: расследуйте'}
          </p>
          <button
            onClick={() => setShowLog(!showLog)}
            className="text-[9px] text-zinc-500 hover:text-zinc-300 px-1"
          >
            {showLog ? '▼ Лог' : '▶ Лог'}
          </button>
        </div>

        {/* Жертвы */}
        {gameState.victims.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[9px] text-red-500">💀</span>
            {gameState.victims.map((v, i) => (
              <span key={i} className="text-[9px] text-red-400/70">
                {v.role || v.name}
                {i < gameState.victims.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        )}

        {/* Лог */}
        {showLog && actionLog.length > 0 && (
          <div className="mt-1 pt-1 border-t border-zinc-800 max-h-20 overflow-y-auto">
            {actionLog.slice(-5).map((log, i) => (
              <p key={i} className="text-[9px] text-zinc-500">
                {log}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Сетка */}
      <div className="flex-1 flex items-center justify-center p-3">
        <CompactGrid
          grid={gameState.grid}
          buildings={gameState.buildings}
          detectivePosition={gameState.detective.position}
          crimeScenes={gameState.crimeScenes}
          frightenedResidents={[...gameState.frightenedResidents, ...frightenTargets]}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
        />
      </div>

      {/* Action Bar */}
      <ActionBar
        phase={gameState.phase}
        playerRole={playerRole}
        actionsLeft={gameState.detective.actionsLeft}
      />

      {/* Bottom Sheet */}
      {selectedDistrict !== null && (
        <DistrictSheet
          districtIndex={selectedDistrict}
          citizens={gameState.grid[selectedDistrict]}
          building={gameState.buildings.find((b) => b.position === selectedDistrict)}
          hasDetective={gameState.detective.position === selectedDistrict}
          hasCrimeScene={gameState.crimeScenes.includes(selectedDistrict)}
          frightenedIds={[...gameState.frightenedResidents, ...frightenTargets]}
          playerRole={playerRole}
          phase={gameState.phase}
          onClose={() => setSelectedDistrict(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};
