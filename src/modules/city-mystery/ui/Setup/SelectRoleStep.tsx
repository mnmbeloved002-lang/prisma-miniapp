import type React from 'react';
import { useEffect } from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { AIDifficulty, PlayerRole } from '../../data/gameTypes';
import { Typewriter } from './Typewriter';

interface RoleCardProps {
  playerRole: PlayerRole;
  caseNumber: string;
  title: string;
  subtitle: string;
  description: string;
  traits: string;
  isSelected: boolean;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  caseNumber,
  title,
  subtitle,
  description,
  traits,
  isSelected,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`
      group w-full text-left transition-all duration-300 relative
      ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
    `}
  >
    <div
      className={`
      relative p-5 border transition-all duration-300
      ${
        isSelected
          ? 'bg-zinc-900/80 border-red-700/60 shadow-[0_0_30px_rgba(185,28,28,0.15)]'
          : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700/60 hover:bg-zinc-900/60'
      }
    `}
    >
      <div
        className={`
        absolute -top-1 right-4 w-3 h-6 rounded-b-sm transition-colors
        ${isSelected ? 'bg-red-600' : 'bg-zinc-700'}
      `}
      />

      {isSelected && (
        <div className="absolute top-3 right-3 px-2 py-0.5 border border-red-600/60 text-red-500 text-[9px] font-bold uppercase tracking-widest rotate-[-3deg]">
          Досье
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`
          w-12 h-12 flex items-center justify-center border-2 text-lg font-black
          ${
            isSelected
              ? 'border-red-600/60 text-red-500 bg-red-950/30'
              : 'border-zinc-700/60 text-zinc-500 bg-zinc-800/50'
          }
        `}
        >
          {caseNumber}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`
            text-base sm:text-lg font-bold uppercase tracking-wider mb-0.5
            ${isSelected ? 'text-red-400' : 'text-zinc-300'}
          `}
          >
            {title}
          </h3>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">{subtitle}</p>
          <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">{description}</p>
          <p className="text-[10px] text-zinc-600 mt-2 italic">"{traits}"</p>
        </div>
      </div>

      <div
        className={`
        absolute bottom-0 left-0 h-0.5 transition-all duration-500
        ${isSelected ? 'w-full bg-red-700/50' : 'w-0 bg-zinc-700'}
      `}
      />
    </div>
  </button>
);

interface DifficultyButtonProps {
  level: AIDifficulty;
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const DifficultyButton: React.FC<DifficultyButtonProps> = ({
  label,
  description,
  isSelected,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`
      flex-1 p-3 border transition-all duration-200 text-center
      ${
        isSelected
          ? 'border-red-700/60 bg-red-950/30 text-red-400'
          : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700'
      }
    `}
  >
    <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
    <p className="text-[9px] text-zinc-600 mt-0.5">{description}</p>
  </button>
);

export const SelectRoleStep: React.FC = () => {
  const { setupState, selectRole, setAIDifficulty, nextPhase } = useSetupStore();

  const isPvE = setupState.playMode === 'PVE';
  const difficulty: AIDifficulty = setupState.aiDifficulty ?? 'NORMAL';

  useEffect(() => {
    if (isPvE && setupState.selectedRole && !setupState.aiDifficulty) {
      setAIDifficulty('NORMAL');
    }
  }, [isPvE, setupState.selectedRole, setupState.aiDifficulty, setAIDifficulty]);

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-6 italic leading-relaxed">
        <Typewriter text='"В каждой истории есть две стороны.' speed={35} />
        <br />
        <span className="text-zinc-600">
          <Typewriter text='Выберите свою..."' speed={35} delay={800} />
        </span>
      </p>

      <div className="space-y-3 flex-1">
        <RoleCard
          playerRole="KILLER"
          caseNumber="К"
          title="Убийца"
          subtitle="Охотник в тени"
          description="Устраните 5 жителей города и не попадитесь. Каждый ход — шаг к победе или провалу."
          traits="Скрытность • Саботаж • Устранение"
          isSelected={setupState.selectedRole === 'KILLER'}
          onSelect={() => selectRole('KILLER')}
        />

        <RoleCard
          playerRole="DETECTIVE"
          caseNumber="Д"
          title="Детектив"
          subtitle="Страж закона"
          description="Вычислите маньяка прежде, чем город опустеет. Допросы, улики, дедукция."
          traits="Логика • Допросы • Правосудие"
          isSelected={setupState.selectedRole === 'DETECTIVE'}
          onSelect={() => selectRole('DETECTIVE')}
        />
      </div>

      {/* Выбор сложности AI — только для PvE */}
      {isPvE && setupState.selectedRole && (
        <div className="mt-4 pt-4 border-t border-zinc-800/50">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2 text-center">
            Сложность ИИ-{setupState.selectedRole === 'KILLER' ? 'Детектива' : 'Убийцы'}
          </p>
          <div className="flex gap-2">
            <DifficultyButton
              level="EASY"
              label="Новичок"
              description="Простые ходы"
              isSelected={difficulty === 'EASY'}
              onSelect={() => setAIDifficulty('EASY')}
            />
            <DifficultyButton
              level="NORMAL"
              label="Опытный"
              description="Сбалансировано"
              isSelected={difficulty === 'NORMAL'}
              onSelect={() => setAIDifficulty('NORMAL')}
            />
            <DifficultyButton
              level="HARD"
              label="Мастер"
              description="Без пощады"
              isSelected={difficulty === 'HARD'}
              onSelect={() => setAIDifficulty('HARD')}
            />
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={nextPhase}
          disabled={!setupState.selectedRole}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold
            border transition-all duration-300 relative overflow-hidden
            ${
              setupState.selectedRole
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          {setupState.selectedRole ? 'Принять роль →' : 'Выберите роль'}
        </button>
      </div>
    </div>
  );
};
