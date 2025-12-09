import React from 'react';
import { useSetupStore } from '../../application/setupStore';
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
  
  const renderStep = () => {
    switch (setupState.phase) {
      case 'SELECT_MODE':
        return <SelectModeStep />;
      case 'SELECT_ROLE':
        return <SelectRoleStep />;
      case 'SELECT_MOTIVES':
        return <SelectMotivesStep />;
      case 'PLACE_CITIZENS':
        return <PlaceCitizensStep />;
      case 'PLACE_BUILDINGS':
        return <PlaceBuildingsStep />;
      case 'PLACE_DETECTIVE':
        return <PlaceDetectiveStep />;
      case 'SELECT_KILLER':
        return <SelectKillerStep />;
      case 'SELECT_MOTIVE':
        return <SelectKillerMotiveStep />;
      case 'READY':
        return <SetupReadyStep onStart={onComplete} />;
      default:
        return <div>Неизвестный этап</div>;
    }
  };
  
  const phaseNames: Record<string, string> = {
    'SELECT_MODE': 'Режим игры',
    'SELECT_ROLE': 'Выбор роли',
    'SELECT_MOTIVES': 'Мотивы',
    'PLACE_CITIZENS': 'Жители',
    'PLACE_BUILDINGS': 'Здания',
    'PLACE_DETECTIVE': 'Детектив',
    'SELECT_KILLER': 'Личность',
    'SELECT_MOTIVE': 'Мотив',
    'READY': 'Готово',
  };
  
  const phases = [
    'SELECT_MODE',
    'SELECT_ROLE', 
    'SELECT_MOTIVES',
    'PLACE_CITIZENS',
    'PLACE_BUILDINGS',
    'PLACE_DETECTIVE',
    'SELECT_KILLER',
    'SELECT_MOTIVE',
    'READY',
  ];
  
  const currentIndex = phases.indexOf(setupState.phase);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Прогресс */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          {phases.map((phase, i) => (
            <span 
              key={phase}
              className={`
                ${i === currentIndex ? 'text-yellow-400 font-bold' : ''}
                ${i < currentIndex ? 'text-green-400' : ''}
              `}
            >
              {phaseNames[phase]}
            </span>
          ))}
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / phases.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Ошибка */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}
      
      {/* Текущий шаг */}
      {renderStep()}
    </div>
  );
};
