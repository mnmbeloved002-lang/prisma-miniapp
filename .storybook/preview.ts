import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'telegram-dark',
      values: [
        {
          name: 'telegram-dark',
          value: '#17212B',
        },
        {
          name: 'telegram-light',
          value: '#FFFFFF',
        },
        {
          name: 'telegram-bg',
          value: 'var(--tg-theme-bg-color, #17212B)',
        },
      ],
    },
    layout: 'centered',
  },
};

// biome-ignore lint/style/noDefaultExport: Storybook requires default export
export default preview;
