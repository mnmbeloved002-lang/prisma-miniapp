import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from '../../ui/AppShell';

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'telegram',
      values: [
        { name: 'telegram', value: '#17212B' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

// biome-ignore lint/style/noDefaultExport: Storybook requires default export
export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  args: {
    title: 'My App',
    children: (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center text-5xl">
            🚀
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Добро пожаловать!</h2>
            <p className="text-lg text-gray-300">Это ваше новое приложение</p>
          </div>

          <div className="grid gap-4 mt-8">
            <div className="bg-white/5 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <h3 className="font-semibold text-white">Быстрая загрузка</h3>
                  <p className="text-sm text-gray-400">Оптимизировано для максимальной скорости</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-xl">
                  🎨
                </div>
                <div>
                  <h3 className="font-semibold text-white">Современный дизайн</h3>
                  <p className="text-sm text-gray-400">Красивый и интуитивный интерфейс</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-xl">
                  🔒
                </div>
                <div>
                  <h3 className="font-semibold text-white">Безопасность</h3>
                  <p className="text-sm text-gray-400">Защита ваших данных на первом месте</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400 mt-8">
            <p>🎯 Платформа L5 2026</p>
            <p>Работает на React 19 + TypeScript</p>
          </div>
        </div>
      </div>
    ),
  },
};

export const Dashboard: Story = {
  args: {
    title: 'Dashboard',
    children: (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-white">1,234</div>
            <div className="text-sm text-gray-300 mt-1">Всего пользователей</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold text-white">$45.2K</div>
            <div className="text-sm text-gray-300 mt-1">Доход за месяц</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-white">98.5%</div>
            <div className="text-sm text-gray-300 mt-1">Доступность</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Последняя активность</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="text-2xl">👤</div>
              <div className="flex-1">
                <div className="text-white">Новый пользователь зарегистрирован</div>
                <div className="text-xs text-gray-400">2 минуты назад</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="text-2xl">💳</div>
              <div className="flex-1">
                <div className="text-white">Платёж успешно обработан</div>
                <div className="text-xs text-gray-400">15 минут назад</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="text-2xl">📧</div>
              <div className="flex-1">
                <div className="text-white">Отправлено 10 уведомлений</div>
                <div className="text-xs text-gray-400">1 час назад</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export const ProfileCard: Story = {
  args: {
    title: 'Профиль',
    children: (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 mx-auto flex items-center justify-center text-6xl font-bold text-white mb-4">
              A
            </div>
            <h2 className="text-2xl font-bold text-white">Alex Johnson</h2>
            <p className="text-gray-400">@alexj</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email</span>
              <span className="text-white">alex@example.com</span>
            </div>
            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Телефон</span>
              <span className="text-white">+1 234 567 890</span>
            </div>
            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Локация</span>
              <span className="text-white">San Francisco, CA</span>
            </div>
            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Статус</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                ✓ Активен
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Достижения</h3>
            <div className="grid grid-cols-4 gap-3">
              {['trophy', 'star', 'target', 'gem', 'fire', 'crown', 'art', 'rocket'].map((id) => {
                const emojis: Record<string, string> = {
                  trophy: '🏆',
                  star: '⭐',
                  target: '🎯',
                  gem: '💎',
                  fire: '🔥',
                  crown: '👑',
                  art: '🎨',
                  rocket: '🚀',
                };
                return (
                  <div
                    key={id}
                    className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-3xl border border-purple-500/30"
                  >
                    {emojis[id]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    title: 'Empty State',
    children: (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-white">Пока пусто</h2>
          <p className="text-gray-400">Здесь появится контент когда вы начнёте работу</p>
          <button
            type="button"
            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Начать работу
          </button>
        </div>
      </div>
    ),
  },
};
