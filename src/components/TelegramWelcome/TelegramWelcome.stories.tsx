import type { Meta, StoryObj } from '@storybook/react';
import { TelegramWelcome } from '../../ui/TelegramWelcome';

const meta = {
  // biome-ignore lint/security/noSecrets: false positive - this is component path
  title: 'Components/TelegramWelcome',
  component: TelegramWelcome,
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
} satisfies Meta<typeof TelegramWelcome>;

// biome-ignore lint/style/noDefaultExport: Storybook requires default export
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: 'JohnDoe',
    firstName: 'John',
  },
};

export const WithLongName: Story = {
  args: {
    // biome-ignore lint/security/noSecrets: false positive - this is demo username
    username: 'VeryLongUsernameExample',
    firstName: 'Alexander',
  },
};

export const WithoutUsername: Story = {
  args: {
    username: undefined,
    firstName: 'Anonymous',
  },
};

export const WithEmojiName: Story = {
  args: {
    username: 'cool_user_123',
    firstName: '🚀 Rocket',
  },
};
