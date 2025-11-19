// @ts-nocheck
// src/ui/FilterBar.test.tsx
import { render, screen } from '@testing-library/react';
import React from "react";
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('should call onChange with added category', async () => {
    const onChangeMock = vi.fn();
    render(
      <FilterBar selected={[]} onChange={onChangeMock} total={0} />,
    );

    // Кликаем "спорт"
    await userEvent.click(screen.getByRole('button', { name: 'спорт' }));

    // Ожидаем вызов с ['спорт']
    expect(onChangeMock).toHaveBeenCalledWith(['спорт']);
  });

  it('should call onChange with removed category (Line 14 coverage)', async () => {
    const onChangeMock = vi.fn();
    render(
      <FilterBar
        selected={['спорт', 'политика']}
        onChange={onChangeMock}
        total={2}
      />,
    );

    // Кликаем "спорт" (чтобы удалить его)
    await userEvent.click(screen.getByRole('button', { name: 'спорт' }));

    // Ожидаем вызов с ['политика']
    expect(onChangeMock).toHaveBeenCalledWith(['политика']);
  });
});
