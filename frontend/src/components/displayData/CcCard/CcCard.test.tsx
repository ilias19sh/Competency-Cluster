/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MantineProvider } from '@mantine/core';
import { CcCard } from './CcCard.component';

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

describe('CcCard Component', () => {
  it('doit afficher les composants enfants correctement', () => {
    renderWithProvider(
      <CcCard>
        <div data-testid="child-1">Contenu 1</div>
      </CcCard>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
  });

  it('doit appliquer le radius XL (via variable CSS ou attribut)', () => {
    renderWithProvider(<CcCard>Test Radius</CcCard>);
   const card = screen.getByText('Test Radius').closest('.mantine-Paper-root') as HTMLElement;

    // On vérifie soit l'attribut, soit la variable CSS injectée par Mantine
    const hasRadiusAttr = card?.getAttribute('data-radius') === 'xl';
    const hasRadiusVar = card?.style.getPropertyValue('--paper-radius').includes('xl');
    
    expect(hasRadiusAttr || hasRadiusVar).toBeTruthy();
  });

  it('doit avoir une bordure', () => {
    renderWithProvider(<CcCard>Test Border</CcCard>);
    const card = screen.getByText('Test Border').closest('.mantine-Paper-root');
    
    // Avec withBorder, Mantine ajoute soit data-with-border soit une classe spécifique
    expect(card).toHaveAttribute('data-with-border');
  });

  it('doit appliquer le gap md au Stack interne', () => {
    renderWithProvider(
      <CcCard>
        <span>Item A</span>
      </CcCard>
    );
    const item = screen.getByText('Item A');
    const stack = item.parentElement;
    // On vérifie la présence de la variable de gap
    expect(stack).toHaveStyle({ '--stack-gap': 'var(--mantine-spacing-md)' });
  });

  it('doit fusionner les styles custom et garder le fond blanc', () => {
    renderWithProvider(<CcCard style={{ opacity: 0.5 }}>Test Style</CcCard>);
    const card = screen.getByText('Test Style').closest('.mantine-Paper-root');
    
    expect(card).toHaveStyle({ opacity: '0.5' });
    // On utilise une regex pour le background car JSDOM peut retourner rgb(255, 255, 255)
    expect(card).toHaveStyle('background-color: #FFFFFF');
  });
});