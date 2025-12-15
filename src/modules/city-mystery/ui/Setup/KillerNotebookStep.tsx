import type React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { MOTIVE_CARDS } from '../../data/gameConstants';

const FACTION_RU: Record<string, string> = {
  WORKERS: 'Рабочие',
  LAW: 'Закон',
  CRIME: 'Преступность',
  PRESS: 'Пресса',
  MEDICINE: 'Медицина',
  MIGRANTS: 'Мигранты',
  POWER: 'Власть',
  BOHEMIA: 'Богема',
  MARGINALS: 'Маргиналы',
  OFFICIALS: 'Чиновники',
  CIVILIANS: 'Обыватели',
  CRIMINALS: 'Криминал',
  CLERGY: 'Духовенство',
  OUTSIDERS: 'Маргиналы',
  BOURGEOIS: 'Буржуазия',
  INTELLIGENTSIA: 'Интеллигенция',
};

interface KillerNotebookStepProps {
  onStart: () => void;
}

export const KillerNotebookStep: React.FC<KillerNotebookStepProps> = ({ onStart }) => {
  const { setupState } = useSetupStore();

  const killerCitizen = setupState.availableCitizens.find(
    (c) => c.id === setupState.killerIdentityId,
  );

  const motiveCard = setupState.killerMotive ? MOTIVE_CARDS[setupState.killerMotive] : null;

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-4 italic leading-relaxed">
        "Ваше досье готово...
        <br />
        <span className="text-zinc-600">Помните свою легенду"</span>
      </p>

      {/* Блокнот */}
      <div className="flex-1">
        <div className="relative p-5 border border-red-700/60 bg-zinc-900/80 shadow-[0_0_40px_rgba(185,28,28,0.15)]">
          <div className="absolute -top-1 right-6 w-3 h-8 rounded-b-sm bg-red-600" />

          <div className="absolute top-3 right-3 px-2 py-0.5 border border-red-600/60 text-red-500 text-[9px] font-bold uppercase tracking-widest rotate-[-3deg]">
            Секретно
          </div>

          <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wide mb-4 text-center">
            Досье Убийцы
          </h3>

          <div className="space-y-3">
            {/* Личность */}
            <div className="p-3 border border-zinc-800 bg-zinc-900/50">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Личность</p>
              {killerCitizen ? (
                <>
                  <p className="text-sm text-zinc-300 font-medium">
                    {killerCitizen.gender === 'MALE' ? '👨' : '👩'}{' '}
                    {killerCitizen.name || killerCitizen.role}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {FACTION_RU[killerCitizen.faction] || killerCitizen.faction}
                  </p>
                </>
              ) : (
                <p className="text-sm text-zinc-500">—</p>
              )}
            </div>

            {/* Мотив */}
            <div className="p-3 border border-zinc-800 bg-zinc-900/50">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Мотив</p>
              {motiveCard ? (
                <>
                  <p className="text-sm text-zinc-300 font-medium">
                    {motiveCard.icon} {motiveCard.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">{motiveCard.description}</p>
                </>
              ) : (
                <p className="text-sm text-zinc-500">—</p>
              )}
            </div>

            {/* Союзники */}
            <div className="p-3 border border-zinc-800 bg-zinc-900/50">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Союзники</p>
              <p className="text-sm text-zinc-300">
                {setupState.killerAllies
                  ? FACTION_RU[setupState.killerAllies] || setupState.killerAllies
                  : '—'}
              </p>
              {setupState.killerAllies && (
                <p className="text-[10px] text-zinc-500 mt-1">Не дадут показаний против вас</p>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700/50" />
        </div>
      </div>

      <p className="text-[10px] text-zinc-600 text-center mt-4 italic">
        Детектив уже на месте. Охота начинается.
      </p>

      <div className="mt-4 pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold border transition-all duration-300 bg-red-950/30 text-red-400 border-red-700/60 hover:bg-red-950/50 hover:shadow-[0_0_30px_rgba(185,28,28,0.3)]"
          style={{ minHeight: '52px' }}
        >
          🔪 Начать охоту
        </button>
      </div>
    </div>
  );
};
