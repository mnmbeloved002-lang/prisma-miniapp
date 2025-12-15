import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { FACTION_ICONS } from '../data/gameConstants';

interface CitizenCardProps {
  citizen: {
    id: string;
    role: string;
    gender: 'MALE' | 'FEMALE';
    age: number;
    build: string;
    faction: string;
  };
  isFrightened: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const CitizenCard: React.FC<CitizenCardProps> = ({
  citizen,
  isFrightened,
  isSelected,
  onClick,
}) => {
  const genderSymbol = citizen.gender === 'MALE' ? '♂' : '♀';

  // Динамические стили для состояний
  const getBorderColor = () => {
    if (isSelected) {
      return 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]';
    }
    if (isFrightened) {
      return 'border-red-900/50';
    }
    return 'border-white/10 hover:border-white/30';
  };

  const getBackground = () => {
    if (isSelected) {
      return 'bg-yellow-900/20';
    }
    if (isFrightened) {
      return 'bg-gray-900/80 grayscale opacity-60';
    }
    return 'bg-white/5';
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isFrightened}
      className={`
        relative w-full flex flex-col gap-1 rounded-xl border px-2 py-1.5
        backdrop-blur-sm transition-colors duration-300
        ${getBorderColor()}
        ${getBackground()}
      `}
      // Анимации
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!isFrightened ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isFrightened ? { scale: 0.95 } : {}}
      layout
    >
      {/* Маркер выбора (анимированное кольцо) */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            layoutId="selection-ring"
            className="absolute inset-0 rounded-xl border-2 border-yellow-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}
      </AnimatePresence>

      {/* Иконка запугивания (всплывает) */}
      <AnimatePresence>
        {isFrightened && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              😱
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Верхняя часть: Роль и Пол/Возраст */}
      <div className="w-full flex items-center justify-between z-10">
        <span className="font-bold text-xs text-gray-100 truncate max-w-[70%]">{citizen.role}</span>
        <span className="text-[10px] font-mono text-gray-400 bg-black/30 px-1.5 rounded">
          {genderSymbol}
          {citizen.age}
        </span>
      </div>

      {/* Нижняя часть: Характеристики и Фракция */}
      <div className="w-full flex items-center justify-between mt-1 z-10">
        <span className="text-[9px] text-gray-400 truncate">
          {citizen.build === 'SLIM' && 'Худой'}
          {citizen.build === 'MEDIUM' && 'Средний'}
          {citizen.build === 'LARGE' && 'Крепкий'}
        </span>

        {/* Иконка фракции с тултипом */}
        <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded-md border border-white/5">
          <span className="text-xs leading-none">{FACTION_ICONS[citizen.faction]}</span>
        </div>
      </div>
    </motion.button>
  );
};
