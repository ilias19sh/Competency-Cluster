/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MantineProvider } from '@mantine/core';
import { CcTitle } from './CcTitle.component';

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

describe('CcTitle Component', () => {
  it('doit afficher le titre correctement', () => {
    renderWithProvider(<CcTitle>Mon Titre</CcTitle>);
    expect(screen.getByText('Mon Titre')).toBeInTheDocument();
  });

  it('doit respecter l\'ordre du titre (h1, h2, etc.)', () => {
    renderWithProvider(<CcTitle order={3}>Titre H3</CcTitle>);
    const title = screen.getByText('Titre H3');
    // Mantine transforme order={3} en balise <h3>
    expect(title.tagName).toBe('H3');
  });

  it('doit afficher l\'icône chevron par défaut', () => {
    const { container } = renderWithProvider(<CcTitle>Titre avec icône</CcTitle>);
    // Les icônes Tabler sont des éléments SVG
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('ne doit pas afficher l\'icône si withChevron est false', () => {
    const { container } = renderWithProvider(
      <CcTitle withChevron={false}>Titre sans icône</CcTitle>
    );
    const icon = container.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('doit appliquer la couleur grise désactivée quand disabled est vrai', () => {
    renderWithProvider(<CcTitle disabled>Titre désactivé</CcTitle>);
    const title = screen.getByText('Titre désactivé') as HTMLElement;
    
    // On vérifie la variable de couleur Mantine
    expect(title).toHaveStyle('color: var(--mantine-color-gray-4)');
  });

  it('doit appliquer les styles bold et italic', () => {
    renderWithProvider(<CcTitle bold italic>Titre Stylisé</CcTitle>);
    const title = screen.getByText('Titre Stylisé') as HTMLElement;
    
    expect(title).toHaveStyle({
      'font-weight': '700',
      'font-style': 'italic'
    });
  });

  it('doit réduire l\'opacité de l\'icône quand disabled est vrai', () => {
    const { container } = renderWithProvider(<CcTitle disabled>Titre</CcTitle>);
    const icon = container.querySelector('svg') as unknown as HTMLElement;
    
    expect(icon).toHaveStyle('opacity: 0.5');
  });
});