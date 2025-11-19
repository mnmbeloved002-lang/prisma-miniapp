// @ts-nocheck
// src/components/HelloButton.tsx
import { useState } from 'react';

export function HelloButton() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Click me</button>
      <p data-testid="clicks">Clicks: {count}</p>
    </div>
  );
}
