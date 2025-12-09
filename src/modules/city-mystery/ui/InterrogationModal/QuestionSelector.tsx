/**
 * Селектор вопроса для допроса
 */

import React from 'react';
import { AVAILABLE_QUESTIONS } from '../../data/engine';

interface QuestionSelectorProps {
  onSelect: (question: string, value: string, label: string) => void;
}

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      {AVAILABLE_QUESTIONS.map((q) => (
        <div key={q.type}>
          <div className="text-sm text-gray-400 mb-2">{q.label}</div>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelect(q.type, opt.value, opt.label)}
                className="px-4 py-2 bg-gray-700 hover:bg-blue-600 
                  rounded-lg text-sm transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
