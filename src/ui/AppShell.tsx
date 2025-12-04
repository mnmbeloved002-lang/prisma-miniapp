import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppShellProps {
  children?: ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps): JSX.Element {
  return (
    <div className="app-shell">
      <Header title={title} />
      <main>{children}</main>
    </div>
  );
}

// biome-ignore lint/style/noDefaultExport: оставляем default-экспорт для совместимости с существующими импортами и тестами
export default AppShell;
