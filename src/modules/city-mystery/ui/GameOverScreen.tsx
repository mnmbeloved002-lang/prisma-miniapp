import React from 'react';

export const GameOverScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">Игра окончена</h1>
        <p className="text-xl text-gray-300 mb-8">Экран завершения игры в разработке...</p>
      </div>
    </div>
  );
};
