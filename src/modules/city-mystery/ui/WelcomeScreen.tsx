import React, { useEffect, useRef } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Логика отрисовки дождя на Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let drops: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];

    // Настройка размеров
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops();
    };

    // Инициализация капель (создаем 150-300 капель в зависимости от ширины)
    const initDrops = () => {
      drops = [];
      const count = Math.floor(window.innerWidth / 3); // Плотность дождя
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 15 + 10, // Разная скорость (параллакс)
          length: Math.random() * 20 + 10, // Разная длина
          opacity: Math.random() * 0.3 + 0.05 // Разная прозрачность (глубина)
        });
      }
    };

    // Анимация
    const draw = () => {
      // Очищаем экран с легким шлейфом (для плавности)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем каждую каплю
      drops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(200, 200, 250, ${drop.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Обновляем позицию
        drop.y += drop.speed;

        // Если капля улетела вниз, возвращаем наверх в случайную точку
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
          drop.speed = Math.random() * 15 + 10;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 overflow-hidden text-zinc-200 font-mono">
      
      {/* 1. CANVAS RAIN (Физический дождь) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
      />

      {/* 2. ЛЕГКИЙ ШУМ (Очень прозрачный, только для текстуры) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Виньетка */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] z-20" />

      {/* Стили для мерцания */}
      <style>{`
        @keyframes flicker-slow {
          0%, 100% { opacity: 1; text-shadow: 0 0 30px rgba(220, 38, 38, 0.6); }
          50% { opacity: 0.8; text-shadow: 0 0 10px rgba(220, 38, 38, 0.3); }
          52% { opacity: 0.4; }
          54% { opacity: 0.8; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* КОНТЕНТ (Поверх всего) */}
      <div className="relative z-30 flex flex-col items-center text-center w-full max-w-lg mt-10">
        
        <div className="mb-16 space-y-4 animate-[slide-up_1s_ease-out]">
          <p className="text-xs tracking-[0.4em] text-zinc-500 uppercase font-bold">
            ДЕЛО ОТКРЫТО
          </p>
          
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-800 leading-none select-none drop-shadow-lg">
              CITY
            </h1>
            <h1 
              className="text-6xl md:text-8xl font-black tracking-tighter text-red-700 leading-none select-none relative top-[-10px]"
              style={{ animation: 'flicker-slow 4s infinite' }}
            >
              MYSTERY
            </h1>
          </div>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-red-900 to-transparent mx-auto mt-8 mb-4" />
          
          <p className="text-sm md:text-base text-zinc-400 font-serif italic tracking-wide opacity-70">
            "В этом городе правды нет.<br/>Есть только улики."
          </p>
        </div>

        <button 
          onClick={onStart}
          className="group relative px-12 py-5 bg-transparent border border-zinc-800 hover:border-red-800 text-zinc-500 hover:text-white transition-all duration-500 ease-out uppercase tracking-[0.2em] text-sm font-bold active:scale-95 overflow-hidden rounded-sm"
        >
          <div className="absolute inset-0 w-0 bg-red-950 transition-all duration-[400ms] ease-out group-hover:w-full opacity-40" />
          <span className="relative z-10 flex items-center gap-3 group-hover:text-red-100 transition-colors">
            Войти в город
          </span>
        </button>

      </div>

      <div className="absolute bottom-6 text-[10px] text-zinc-800 tracking-widest uppercase font-bold z-30">
        Prisma MiniAPP
      </div>
    </div>
  );
};
