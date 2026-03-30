/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers'; // Importe les matchers
import { MantineProvider } from '@mantine/core';
import { CcButton } from './CcButton.component';

// Cette ligne lie les fonctions comme toBeInTheDocument à Vitest
expect.extend(matchers);

// Nettoyage après chaque test pour éviter les doublons
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
    cleanup(); // Nettoie le DOM avant chaque rendu pour éviter les interférences entre les tests
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('CcButton Component', () => {
  it('doit afficher le contenu correctement', () => {
    renderWithProvider(<CcButton>Cliquez ici</CcButton>);
    expect(screen.getByRole('button', { name: /cliquez ici/i })).toBeInTheDocument();
  });

  it('doit appeler la fonction onClick lors du clic', () => {
    const handleClick = vi.fn();
    renderWithProvider(<CcButton onClick={handleClick}>Bouton Test</CcButton>);
    
    // On cible spécifiquement CE bouton par son texte
    const button = screen.getByRole('button', { name: /bouton test/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ne doit pas être cliquable lorsqu\'il est désactivé', () => {
    renderWithProvider(<CcButton disabled>Bouton Bloqué</CcButton>);
    const button = screen.getByRole('button', { name: /bouton bloqué/i });
    expect(button).toBeDisabled();
  });

  it('doit être en pleine largeur quand la prop expandable est true', () => {
    renderWithProvider(<CcButton expandable>Expandable</CcButton>);
    const button = screen.getByRole('button', { name: /expandable/i });
    expect(button).toHaveAttribute('data-block', 'true'); // Mantine v7 utilise data-block pour fullWidth
  });

  it('doit appliquer la couleur orange pour la variante full-orange', () => {
    renderWithProvider(<CcButton variant="full-orange">Orange</CcButton>);
    const button = screen.getByRole('button', { name: /orange/i });
    expect(button).toHaveAttribute('data-variant', 'filled');
  });

  it('doit utiliser le variant gradient par défaut', () => {
    renderWithProvider(<CcButton>Bouton Gradient</CcButton>);
    const button = screen.getByRole('button', { name: /bouton gradient/i });
    expect(button).toHaveAttribute('data-variant', 'gradient');
  });
});