/**
 * Модалка допроса жителя
 */

import React, { useState } from 'react';
import { QuestionSelector } from './QuestionSelector';

interface InterrogationModalProps {
  residentName: string;
  residentId: string;
  isOpen: boolean;
  onClose: () => void;
  onInterrogate: (question: string, value: string) => Promise<{ answer: boolean; canLie: boolean }>;
}

type ModalStep = 'SELECT_QUESTION' | 'SHOW_ANSWER';

interface AnswerData {
  question: string;
  answer: boolean;
  canLie: boolean;
}

export const InterrogationModal: React.FC<InterrogationModalProps> = ({
  residentName,
  residentId,
  isOpen,
  onClose,
  onInterrogate,
}) => {
  const [step, setStep] = useState<ModalStep>('SELECT_QUESTION');
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectQuestion = async (question: string, value: string, label: string) => {
    setIsLoading(true);
    try {
      const result = await onInterrogate(question, value);
      setAnswerData({
        question: label,
        answer: result.answer,
        canLie: result.canLie,
      });
      setStep('SHOW_ANSWER');
    } catch (error) {
      console.error('Ошибка допроса:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('SELECT_QUESTION');
    setAnswerData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            🔍 Допрос: {residentName}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            Допрашиваем...
          </div>
        ) : step === 'SELECT_QUESTION' ? (
          <div>
            <p className="text-gray-300 mb-4">
              Выберите вопрос об убийце:
            </p>
            <QuestionSelector onSelect={handleSelectQuestion} />
          </div>
        ) : answerData ? (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-2">Вопрос:</p>
            <p className="text-lg font-semibold mb-6">{answerData.question}</p>
            
            <p className="text-gray-400 mb-2">Ответ:</p>
            <div className={`text-4xl font-bold mb-4 ${
              answerData.answer ? 'text-green-400' : 'text-red-400'
            }`}>
              {answerData.answer ? '✓ ДА' : '✗ НЕТ'}
            </div>
            
            {answerData.canLie && (
              <p className="text-yellow-500 text-sm mb-4">
                ⚠️ Этот житель мог солгать
              </p>
            )}
            
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 
                rounded-lg font-semibold transition-colors"
            >
              Понятно
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
