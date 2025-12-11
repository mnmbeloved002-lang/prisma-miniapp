import type React from 'react';
import { useEffect, useRef } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Дождь на Canvas (оптимизированный для мобильных)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let animationFrameId: number;
    let drops: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];

    const resize = () => {
      // Используем visualViewport для корректного размера на мобильных
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      canvas.width = vw;
      canvas.height = vh;
      initDrops();
    };

    const initDrops = () => {
      drops = [];
      // Меньше капель на мобильных для производительности
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 60 : 120;

      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 12 + 8,
          length: Math.random() * 15 + 8,
          opacity: Math.random() * 0.25 + 0.05,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 0.5, drop.y + drop.length);
        ctx.strokeStyle = `rgba(180, 180, 220, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // Слушаем и resize и visualViewport
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full bg-black flex flex-col items-center justify-between overflow-hidden text-zinc-200"
      style={{
        height: '100dvh', // dynamic viewport height для мобильных
        touchAction: 'none', // отключаем жесты
      }}
    >
      {/* Canvas дождь */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-50" />

      {/* Тонкий шум для текстуры */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Виньетка */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_70%,#000_100%)] z-20" />

      {/* Стили анимаций */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; filter: brightness(1); }
          92% { opacity: 1; filter: brightness(1); }
          93% { opacity: 0.8; filter: brightness(0.8); }
          94% { opacity: 1; filter: brightness(1); }
          96% { opacity: 0.9; filter: brightness(0.9); }
          97% { opacity: 1; filter: brightness(1); }
        }
        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(185, 28, 28, 0.5), 0 0 40px rgba(185, 28, 28, 0.2); }
          50% { text-shadow: 0 0 30px rgba(185, 28, 28, 0.7), 0 0 60px rgba(185, 28, 28, 0.3); }
        }
      `}</style>

      {/* Верхняя часть — пустота для баланса */}
      <div className="flex-1" />

      {/* ЦЕНТР — Логотип */}
      <div
        className="relative z-30 flex flex-col items-center text-center px-6"
        style={{ animation: 'fadeUp 1.2s ease-out' }}
      >
        <p className="text-[10px] sm:text-xs tracking-[0.5em] text-zinc-600 uppercase font-medium mb-4">
          Дело открыто
        </p>

        <div className="relative">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-zinc-800 leading-none select-none">
            CITY
          </h1>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-red-700 leading-none select-none -mt-2"
            style={{ animation: 'flicker 5s infinite, pulse-glow 3s ease-in-out infinite' }}
          >
            MYSTERY
          </h1>
        </div>

        <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-red-900/60 to-transparent mx-auto mt-6 mb-4" />

        <p className="text-xs sm:text-sm text-zinc-500 italic max-w-[250px] leading-relaxed">
          "В этом городе правды нет.
          <br />
          Есть только улики."
        </p>
      </div>

      {/* Нижняя часть — Кнопка */}
      <div className="flex-1 flex flex-col items-center justify-end pb-8 sm:pb-12 relative z-30">
        <button
          type="button"
          onClick={onStart}
          className="group relative px-10 sm:px-14 py-4 sm:py-5 bg-transparent border border-zinc-800 hover:border-red-900 text-zinc-500 hover:text-zinc-200 transition-all duration-500 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold active:scale-95 overflow-hidden"
          style={{ minHeight: '52px' }} // Минимум для пальца
        >
          {/* Hover эффект */}
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-red-950/50 to-red-900/30 transition-all duration-500 group-hover:w-full" />
          <span className="relative z-10">Войти в город</span>
        </button>

        <p className="mt-6 text-[9px] text-zinc-700 tracking-widest uppercase">Prisma MiniApp</p>
      </div>
    </div>
  );
};
