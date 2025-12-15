/**
 * Информация о текущей фазе игры
 */

import type React from 'react';
import type { GamePhase, PhaseStep, PlayerRole } from '../../data/gameTypes';

interface PhaseInfoProps {
  phase: GamePhase;
  step: PhaseStep;
  playerRole: PlayerRole;
}

interface PhaseContent {
  title: string;
  description: string;
}

function getPhaseContent(phase: GamePhase, step: PhaseStep, playerRole: PlayerRole): PhaseContent {
  if (playerRole === 'KILLER') {
    if (phase === 'KILLER' && step === 'FRIGHTEN') {
      return {
        title: '🔪 Запугивание',
        description: 'Выберите 2 жителей для запугивания. Нельзя выбирать в квартале с детективом.',
      };
    }
    if (phase === 'KILLER' && step === 'KILL') {
      return {
        title: '💀 Убийство',
        description: 'Выберите жертву согласно вашему мотиву.',
      };
    }
    if (phase === 'DETECTIVE') {
      return {
        title: '🕵️ Ход детектива',
        description: 'Ожидайте. Следите за действиями детектива.',
      };
    }
    if (phase === 'CITY') {
      return {
        title: '🏙️ Фаза города',
        description: 'Жители перемещаются по городу.',
      };
    }
  }

  // DETECTIVE
  if (phase === 'DETECTIVE' && step === 'URGENT_CALL') {
    return {
      title: '🚨 Срочный вызов',
      description: 'Вы перемещаетесь на место преступления.',
    };
  }
  if (phase === 'DETECTIVE' && step === 'INVESTIGATE') {
    return {
      title: '🔍 Расследование',
      description: '2 действия и 2 очка движения. Допрашивайте, используйте здания.',
    };
  }
  if (phase === 'KILLER') {
    return {
      title: '🔪 Ход убийцы',
      description: 'Ожидайте. Следите за запуганными и убитыми.',
    };
  }
  if (phase === 'CITY') {
    return {
      title: '🏙️ Фаза города',
      description: 'Успокойте запуганных в вашем квартале.',
    };
  }

  return { title: 'Игра', description: '' };
}

export const PhaseInfo: React.FC<PhaseInfoProps> = ({ phase, step, playerRole }) => {
  const { title, description } = getPhaseContent(phase, step, playerRole);

  return (
    <div className="mb-4">
      <div className="text-lg font-semibold text-white mb-1">{title}</div>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};
