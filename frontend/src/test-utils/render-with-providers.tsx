// src/test-utils/render-with-providers.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { TranslationProvider } from '../i18n/TranslationProvider'; // adjust path if needed
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

type ExtraOptions = {
  /**
   * If you need routing in tests, pass MemoryRouter props (initialEntries, initialIndex, etc.).
   * Default: no routing (initialEntries undefined).
   */
  routerProps?: MemoryRouterProps;
};

/**
 * renderWithProviders
 * - Wraps UI with TranslationProvider and a MemoryRouter (for deterministic test routing).
 * - Accepts standard render options and extra options for router configuration.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & ExtraOptions
): RenderResult {
  const { routerProps, ...renderOptions } = (options || {}) as any;

  return render(
    <TranslationProvider>
      <MemoryRouter {...(routerProps ?? {})}>{ui}</MemoryRouter>
    </TranslationProvider>,
    renderOptions
  );
}
