import type React from 'react';

interface LobbyScreenProps {
  onSelectRole: (role: 'KILLER' | 'DETECTIVE') => void;
  onStartTutorial: () => void;
  userName?: string;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onSelectRole,
  onStartTutorial,
  userName,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">ГОРОДСКОЙ УБИЙЦА</h1>
          <p className="text-xl text-gray-300 mb-2">Детективная игра в стиле нуар</p>

          {userName && (
            <div className="mt-6 inline-block px-6 py-3 bg-gray-800/50 rounded-full">
              👋 Добро пожаловать, <span className="font-bold">{userName}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Карточка Убийцы */}
          <button
            type="button"
            className="w-full text-left bg-gradient-to-br from-red-900/30 to-black border-2 border-red-700/50 rounded-2xl p-8 hover:border-red-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
            onClick={() => onSelectRole('KILLER')}
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🔪</div>
              <h2 className="text-3xl font-bold mb-4">УБИЙЦА</h2>
              <p className="text-gray-300 mb-6">
                Планируйте, скрывайтесь, убивайте. Ваша задача — совершить 5 убийств, следуя своему
                тайному мотиву.
              </p>
              <div className="mt-8 w-full py-4 bg-red-700 hover:bg-red-600 rounded-xl font-bold text-lg">
                ВЫБРАТЬ УБИЙЦУ
              </div>
            </div>
          </button>

          {/* Карточка Детектива */}
          <button
            type="button"
            className="w-full text-left bg-gradient-to-br from-blue-900/30 to-black border-2 border-blue-700/50 rounded-2xl p-8 hover:border-blue-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            onClick={() => onSelectRole('DETECTIVE')}
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🕵️</div>
              <h2 className="text-3xl font-bold mb-4">ДЕТЕКТИВ</h2>
              <p className="text-gray-300 mb-6">
                Расследуйте, допрашивайте, вычисляйте. Ваша задача — найти убийцу и его мотив до
                5-го убийства.
              </p>
              <div className="mt-8 w-full py-4 bg-blue-700 hover:bg-blue-600 rounded-xl font-bold text-lg">
                ВЫБРАТЬ ДЕТЕКТИВА
              </div>
            </div>
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onStartTutorial}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-lg"
          >
            📚 ОБУЧЕНИЕ И ПРАВИЛА
          </button>
        </div>
      </div>
    </div>
  );
};
