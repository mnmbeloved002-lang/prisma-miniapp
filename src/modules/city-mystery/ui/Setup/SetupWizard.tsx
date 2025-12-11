import React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { SetupLayout } from './SetupLayout';
import { SelectModeStep } from './SelectModeStep';
import { SelectRoleStep } from './SelectRoleStep';
import { SelectMotivesStep } from './SelectMotivesStep';
import { PlaceCitizensStep } from './PlaceCitizensStep';
import { PlaceBuildingsStep } from './PlaceBuildingsStep';
import { PlaceDetectiveStep } from './PlaceDetectiveStep';
import { SelectKillerStep } from './SelectKillerStep';
import { SelectKillerMotiveStep } from './SelectKillerMotiveStep';
import { SetupReadyStep } from './SetupReadyStep';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const { setupState, error } = useSetupStore();
  
  const phaseNames: Record<string, string> = {
    'SELECT_MODE': 'РЕЖИМ ИГРЫ',
    'SELECT_ROLE': 'ВЫБОР РОЛИ',
    'SELECT_MOTIVES': 'БАЗА МОТИВОВ',
    'PLACE_CITIZENS': 'НАСЕЛЕНИЕ',
    'PLACE_BUILDINGS': 'ИНФРАСТРУКТУРА',
    'PLACE_DETECTIVE': 'ПОЗИЦИЯ ДЕТЕКТИВА',
    'SELECT_KILLER': 'ЛИЧНОСТЬ',
    'SELECT_MOTIVE': 'МОТИВ ПРЕСТУПЛЕНИЯ',
    'READY': 'ГОТОВНОСТЬ',
  };
  
  const phases = [
    'SELECT_MODE', 'SELECT_ROLE', 'SELECT_MOTIVES',
    'PLACE_CITIZENS', 'PLACE_BUILDINGS', 'PLACE_DETECTIVE',
    'SELECT_KILLER', 'SELECT_MOTIVE', 'READY',
  ];
  
  const renderStep = () => {
    switch (setupState.phase) {
      case 'SELECT_MODE': return <SelectModeStep />;
      case 'SELECT_ROLE': return <SelectRoleStep />;
      case 'SELECT_MOTIVES': return <SelectMotivesStep />;
      case 'PLACE_CITIZENS': return <PlaceCitizensStep />;
      case 'PLACE_BUILDINGS': return <PlaceBuildingsStep />;
      case 'PLACE_DETECTIVE': return <PlaceDetectiveStep />;
      case 'SELECT_KILLER': return <SelectKillerStep />;
      case 'SELECT_MOTIVE': return <SelectKillerMotiveStep />;
      case 'READY': return <SetupReadyStep onStart={onComplete} />;
      default: return <div>Неизвестный этап</div>;
    }
  };
  
  const currentIndex = phases.indexOf(setupState.phase);
  
  return (
    <SetupLayout
      currentPhase={setupState.phase}
      currentPhaseIndex={currentIndex}
      totalPhases={phases.length}
      title={phaseNames[setupState.phase] || 'НАСТРОЙКА'}
      error={error}
    >
      {renderStep()}
    </SetupLayout>
  );
};
