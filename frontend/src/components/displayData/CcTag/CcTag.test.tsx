/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MantineProvider } from '@mantine/core';
import { CcTag } from './CcTag.component';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('CcTag Component', () => {
  it('doit afficher le texte correctement', () => {
    renderWithProvider(<CcTag>Badge Info</CcTag>);
    expect(screen.getByText('Badge Info')).toBeInTheDocument();
  });

  it('doit être rendu sous forme de span', () => {
    renderWithProvider(<CcTag>Span Test</CcTag>);
    const tag = screen.getByText('Span Test') as HTMLElement;
    expect(tag.tagName).toBe('SPAN');
  });

  it('doit appliquer les styles visuels par défaut', () => {
    renderWithProvider(<CcTag>Style Test</CcTag>);
    const tag = screen.getByText('Style Test') as HTMLElement;

    expect(tag).toHaveStyle('display: inline-flex');
    expect(tag).toHaveStyle('align-items: center');
    expect(tag).toHaveStyle('border-radius: 1000px');
  });

  it('doit avoir un effet de flou en arrière-plan', () => {
    renderWithProvider(<CcTag>Blur Test</CcTag>);
    const tag = screen.getByText('Blur Test') as HTMLElement;
    expect(tag.style.backdropFilter).toBe('blur(4px)');
  });

  it('doit permettre de surcharger les styles via la prop style', () => {
    renderWithProvider(
      <CcTag style={{ color: 'rgb(255, 0, 0)', marginTop: '10px' }}>Custom Color</CcTag>
    );
    const tag = screen.getByText('Custom Color') as HTMLElement;

    // Utilisation de chaînes séparées pour éviter les conflits de formatage JSDOM
    expect(tag).toHaveStyle('color: rgb(255, 0, 0)');
    expect(tag).toHaveStyle('margin-top: 10px');
    expect(tag).toHaveStyle('user-select: none');
  });

  it('doit transmettre les autres props de Box', () => {
    renderWithProvider(<CcTag id="my-unique-tag">Prop Test</CcTag>);
    const tag = screen.getByText('Prop Test') as HTMLElement;
    expect(tag).toHaveAttribute('id', 'my-unique-tag');
  });
});