/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MantineProvider } from '@mantine/core';
import { CcText } from './CcText.component';

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

describe('CcText Component', () => {
  it('doit afficher le contenu textuel', () => {
    renderWithProvider(<CcText>Mon texte</CcText>);
    expect(screen.getByText('Mon texte')).toBeInTheDocument();
  });

  it('doit appliquer les styles par défaut (poids 500 et couleur grise)', () => {
    renderWithProvider(<CcText>Texte défaut</CcText>);
    const text = screen.getByText('Texte défaut') as HTMLElement;
    
    expect(text).toHaveStyle({
      color: 'rgb(119, 119, 119)', // #777777
      'font-weight': '500',
      'font-style': 'normal'
    });
  });

  it('doit passer en gras quand la prop bold est présente', () => {
    renderWithProvider(<CcText bold>Texte gras</CcText>);
    const text = screen.getByText('Texte gras') as HTMLElement;
    expect(text).toHaveStyle('font-weight: 700');
  });

  it('doit être en italique quand la prop italic est présente', () => {
    renderWithProvider(<CcText italic>Texte italique</CcText>);
    const text = screen.getByText('Texte italique') as HTMLElement;
    expect(text).toHaveStyle('font-style: italic');
  });

  it('doit réduire l\'opacité quand la prop dimmed est présente', () => {
    renderWithProvider(<CcText dimmed>Texte estompé</CcText>);
    const text = screen.getByText('Texte estompé') as HTMLElement;
    expect(text).toHaveStyle('opacity: 0.6');
  });

  it('doit utiliser une balise span quand inline est vrai', () => {
    renderWithProvider(<CcText inline>Texte inline</CcText>);
    const text = screen.getByText('Texte inline') as HTMLElement;
    // Mantine transforme span={true} en balise <span>
    expect(text.tagName).toBe('SPAN');
  });

  it('doit permettre de changer la couleur via la prop color', () => {
    const customColor = 'rgb(255, 0, 0)';
    renderWithProvider(<CcText color={customColor}>Texte rouge</CcText>);
    const text = screen.getByText('Texte rouge') as HTMLElement;
    expect(text).toHaveStyle(`color: ${customColor}`);
  });

  it('doit fusionner les styles additionnels via la prop style', () => {
    renderWithProvider(<CcText style={{ letterSpacing: '2px' }}>Espacé</CcText>);
    const text = screen.getByText('Espacé') as HTMLElement;
    expect(text).toHaveStyle('letter-spacing: 2px');
    expect(text).toHaveStyle('font-family: Montserrat, sans-serif');
  });
});