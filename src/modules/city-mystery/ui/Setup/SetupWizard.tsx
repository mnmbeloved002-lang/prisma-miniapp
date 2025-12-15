import type React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { InfrastructureStep } from './InfrastructureStep';
import { KillerNotebookStep } from './KillerNotebookStep';
// Детектив
import { PlaceCitizensStep } from './PlaceCitizensStep';
import { PlaceDetectiveStep } from './PlaceDetectiveStep';
import { PopulationStep } from './PopulationStep';
import { SelectAlliesStep } from './SelectAlliesStep';
import { SelectKillerMotiveStep } from './SelectKillerMotiveStep';
import { SelectKillerStep } from './SelectKillerStep';
import { SelectModeStep } from './SelectModeStep';
import { SelectMotivesStep } from './SelectMotivesStep';
import { SelectPlayModeStep } from './SelectPlayModeStep';
import { SelectRoleStep } from './SelectRoleStep';
import { SetupLayout } from './SetupLayout';
import { SetupReadyStep } from './SetupReadyStep';
import { WaitingDetectiveStep } from './WaitingDetectiveStep';

interface SetupWizardProps {
  onComplete: () => void;
}

// Шаги для Убийцы
const KILLER_PHASES = [
  'SELECT_MODE', // 1. Режим игры
  'SELECT_ROLE', // 2. Выбор роли
  'SELECT_MOTIVES', // 3. База мотивов
  'POPULATION', // 4. Население (уведомление)
  'INFRASTRUCTURE', // 5. Инфраструктура
  'WAITING_DETECTIVE', // 6. Ожидание детектива
  'SELECT_KILLER', // 7. Выбор личности
  'SELECT_MOTIVE', // 8. Выбор мотива
  'SELECT_ALLIES', // 9. Выбор союзников
  'KILLER_NOTEBOOK', // 10. Финальный экран
] as const;

// Шаги для Детектива
const DETECTIVE_PHASES = [
  'SELECT_MODE',
  'SELECT_ROLE',
  'PLACE_CITIZENS',
  'PLACE_DETECTIVE',
  'READY',
] as const;

// Общие шаги (до выбора роли)
const COMMON_PHASES = ['SELECT_MODE', 'SELECT_PLAY_MODE', 'SELECT_ROLE'] as const;

// Названия фаз
const PHASE_NAMES: Record<string, string> = {
  SELECT_MODE: 'Режим игры',
  SELECT_PLAY_MODE: 'Формат игры',
  SELECT_ROLE: 'Выбор роли',
  SELECT_MOTIVES: 'База мотивов',
  POPULATION: 'Население',
  INFRASTRUCTURE: 'Инфраструктура',
  WAITING_DETECTIVE: 'Ожидание',
  SELECT_KILLER: 'Личность',
  SELECT_MOTIVE: 'Мотив',
  SELECT_ALLIES: 'Союзники',
  KILLER_NOTEBOOK: 'Досье',
  PLACE_CITIZENS: 'Население',
  PLACE_DETECTIVE: 'Позиция',
  READY: 'Готовность',
};

// ID фаз для прогресс-бара
const KILLER_PHASE_IDS = [
  'mode',
  'role',
  'motives',
  'population',
  'infra',
  'wait',
  'killer',
  'motive',
  'allies',
  'notebook',
];
const DETECTIVE_PHASE_IDS = ['mode', 'role', 'citizens', 'position', 'ready'];
const COMMON_PHASE_IDS = ['mode', 'playMode', 'role'];

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const { setupState, error } = useSetupStore();

  // Определяем набор фаз в зависимости от выбранной роли
  const getPhases = (): readonly string[] => {
    if (!setupState.selectedRole) {
      return COMMON_PHASES;
    }
    return setupState.selectedRole === 'DETECTIVE' ? DETECTIVE_PHASES : KILLER_PHASES;
  };

  const getPhaseIds = (): string[] => {
    if (!setupState.selectedRole) {
      return [...COMMON_PHASE_IDS];
    }
    return setupState.selectedRole === 'DETECTIVE'
      ? [...DETECTIVE_PHASE_IDS]
      : [...KILLER_PHASE_IDS];
  };

  const phases = getPhases();
  const phaseIds = getPhaseIds();
  const currentIndex = phases.indexOf(setupState.phase);

  const renderStep = () => {
    switch (setupState.phase) {
      case 'SELECT_MODE':
        return <SelectModeStep />;
      case 'SELECT_PLAY_MODE':
        return <SelectPlayModeStep />;
      case 'SELECT_ROLE':
        return <SelectRoleStep />;
      // Убийца
      case 'SELECT_MOTIVES':
        return <SelectMotivesStep />;
      case 'POPULATION':
        return <PopulationStep />;
      case 'INFRASTRUCTURE':
        return <InfrastructureStep />;
      case 'WAITING_DETECTIVE':
        return <WaitingDetectiveStep />;
      case 'SELECT_KILLER':
        return <SelectKillerStep />;
      case 'SELECT_MOTIVE':
        return <SelectKillerMotiveStep />;
      case 'SELECT_ALLIES':
        return <SelectAlliesStep />;
      case 'KILLER_NOTEBOOK':
        return <KillerNotebookStep onStart={onComplete} />;
      // Детектив
      case 'PLACE_CITIZENS':
        return <PlaceCitizensStep />;
      case 'PLACE_DETECTIVE':
        return <PlaceDetectiveStep />;
      case 'READY':
        return <SetupReadyStep onStart={onComplete} />;
      default:
        return <div>Неизвестный этап</div>;
    }
  };

  return (
    <SetupLayout
      currentPhase={setupState.phase}
      currentPhaseIndex={currentIndex >= 0 ? currentIndex : 0}
      totalPhases={phases.length}
      phaseIds={phaseIds}
      title={PHASE_NAMES[setupState.phase] || 'Настройка'}
      error={error}
    >
      {renderStep()}
    </SetupLayout>
  );
};
