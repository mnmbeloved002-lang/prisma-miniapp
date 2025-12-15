import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightning, setLightning] = useState(false);

  // Молнии — редкие вспышки
  useEffect(() => {
    const flash = () => {
      setLightning(true);
      setTimeout(() => setLightning(false), 150);

      // Следующая молния через 4-12 секунд
      const next = Math.random() * 8000 + 4000;
      setTimeout(flash, next);
    };

    const timeout = setTimeout(flash, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Дождь на Canvas
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
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      canvas.width = vw;
      canvas.height = vh;
      initDrops();
    };

    const initDrops = () => {
      drops = [];
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 100 : 150;

      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: Math.random() * 14 + 10,
          length: Math.random() * 25 + 12,
          opacity: Math.random() * 0.5 + 0.2, // Ярче: 0.2-0.7
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 1, drop.y + drop.length);

        // Градиент для капли — ярче сверху
        const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length);
        gradient.addColorStop(0, `rgba(150, 170, 210, ${drop.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(200, 210, 255, ${drop.opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {
          drop.y = -drop.length - Math.random() * 50;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

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
      className="fixed inset-0 w-full bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex flex-col items-center justify-between overflow-hidden text-zinc-200"
      style={{
        height: '100dvh',
        touchAction: 'none',
      }}
    >
      {/* Canvas дождь */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />

      {/* Молния */}
      <div
        className="absolute inset-0 pointer-events-none z-5 transition-opacity duration-100"
        style={{
          opacity: lightning ? 0.3 : 0,
          background: 'linear-gradient(180deg, rgba(200,200,255,0.4) 0%, transparent 60%)',
        }}
      />

      {/* Силуэт города внизу */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: `
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 80' preserveAspectRatio='none'%3E%3Cpath fill='%23111' d='M0,80 L0,60 L20,60 L20,40 L35,40 L35,55 L50,55 L50,30 L60,30 L60,20 L75,20 L75,45 L90,45 L90,35 L105,35 L105,50 L120,50 L120,25 L140,25 L140,55 L155,55 L155,40 L170,40 L170,60 L185,60 L185,35 L200,35 L200,15 L215,15 L215,45 L230,45 L230,30 L250,30 L250,50 L265,50 L265,40 L280,40 L280,55 L295,55 L295,25 L315,25 L315,45 L330,45 L330,35 L345,35 L345,60 L360,60 L360,45 L380,45 L380,55 L400,55 L400,80 Z'/%3E%3C/svg%3E")
          `,
          backgroundSize: '100% 100%',
          backgroundPosition: 'bottom',
        }}
      />

      {/* Туман внизу */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-15"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(30,30,40,0.5) 50%, rgba(20,20,30,0.8) 100%)',
        }}
      />

      {/* Тонкий шум */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Виньетка */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.9)_100%)] z-25" />

      {/* Стили анимаций */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.7; }
          94% { opacity: 1; }
          96% { opacity: 0.85; }
          97% { opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(185, 28, 28, 0.6), 
                         0 0 40px rgba(185, 28, 28, 0.3),
                         0 0 60px rgba(185, 28, 28, 0.1); 
          }
          50% { 
            text-shadow: 0 0 25px rgba(185, 28, 28, 0.8), 
                         0 0 50px rgba(185, 28, 28, 0.4),
                         0 0 80px rgba(185, 28, 28, 0.2); 
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Верхняя часть */}
      <div className="flex-1 min-h-[15vh]" />

      {/* ЦЕНТР — Логотип */}
      <div
        className="relative z-30 flex flex-col items-center text-center px-6"
        style={{ animation: 'fadeUp 1.5s ease-out' }}
      >
        <p
          className="text-[10px] sm:text-xs tracking-[0.5em] text-zinc-500 uppercase font-medium mb-6"
          style={{ animation: 'float 4s ease-in-out infinite' }}
        >
          Дело открыто
        </p>

        <div className="relative">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-zinc-700 leading-none select-none">
            CITY
          </h1>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-red-600 leading-none select-none -mt-3"
            style={{ animation: 'flicker 6s infinite, glow 3s ease-in-out infinite' }}
          >
            MYSTERY
          </h1>
        </div>

        <div className="h-px w-28 sm:w-36 bg-gradient-to-r from-transparent via-red-700/70 to-transparent mx-auto mt-8 mb-5" />

        <p className="text-xs sm:text-sm text-zinc-400 italic max-w-[280px] leading-relaxed font-light">
          "В этом городе правды нет.
          <br />
          Есть только улики."
        </p>
      </div>

      {/* Нижняя часть — Кнопка */}
      <div className="flex-1 flex flex-col items-center justify-end pb-10 sm:pb-14 relative z-30 min-h-[20vh]">
        <button
          type="button"
          onClick={onStart}
          className="group relative px-12 sm:px-16 py-4 sm:py-5 bg-black/40 backdrop-blur-sm border border-zinc-700/50 hover:border-red-800/70 text-zinc-400 hover:text-zinc-100 transition-all duration-500 uppercase tracking-[0.3em] text-xs sm:text-sm font-medium active:scale-95 overflow-hidden rounded-sm"
          style={{ minHeight: '54px' }}
        >
          {/* Hover эффект */}
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-red-950/60 to-red-900/40 transition-all duration-500 group-hover:w-full" />
          {/* Свечение по краям */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(185,28,28,0.3)]" />
          <span className="relative z-10">Войти в город</span>
        </button>

        <p className="mt-8 text-[9px] text-zinc-600 tracking-[0.3em] uppercase">Prisma MiniApp</p>
      </div>
    </div>
  );
};
