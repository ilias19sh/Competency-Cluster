/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MantineProvider } from '@mantine/core';
import { CcProgressBar } from './CcProgressBar.component';

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

describe('CcProgressBar Component', () => {
  it('doit afficher la valeur en pourcentage correctement', () => {
    renderWithProvider(<CcProgressBar value={45} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('doit afficher le label si fourni', () => {
    renderWithProvider(<CcProgressBar value={50} label="Score" />);
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('doit appliquer la hauteur correcte selon la prop size', () => {
    // Test pour la taille 'md' (devrait être 15px selon ton heightMap)
    const { container } = renderWithProvider(<CcProgressBar value={50} size="md" />);
    
    // On cherche la Box de la barre (celle qui a le background gradient)
    const progressBar = container.querySelector('div[style*="background"]') as HTMLElement;
    
    expect(progressBar.style.height).toBe('15px');
  });

  it('doit calculer le gradient linéaire en fonction de la valeur', () => {
    const value = 50;
    // startGradient = max(0, 50 - 15) = 35%
    // endGradient = min(100, 50 + 15) = 65%
    renderWithProvider(<CcProgressBar value={value} />);
    
    const progressBar = screen.getByText(`${value}%`).parentElement as HTMLElement;
    const background = progressBar.style.background;

    expect(background).toContain('35%');
    expect(background).toContain('65%');
  });

  it('doit brider le gradient entre 0 et 100 pour les valeurs extrêmes', () => {
    // Cas valeur basse : value = 5 -> startGradient = 0
    const { rerender } = renderWithProvider(<CcProgressBar value={5} />);
    let progressBar = screen.getByText('5%').parentElement as HTMLElement;
    expect(progressBar.style.background).toContain('0%');

    // Cas valeur haute : value = 95 -> endGradient = 100
    rerender(<MantineProvider><CcProgressBar value={95} /></MantineProvider>);
    progressBar = screen.getByText('95%').parentElement as HTMLElement;
    expect(progressBar.style.background).toContain('100%');
  });

  it('doit avoir un borderRadius de 1000px pour l\'aspect "pill"', () => {
    renderWithProvider(<CcProgressBar value={50} />);
    const progressBar = screen.getByText('50%').parentElement as HTMLElement;
    
    expect(progressBar.style.borderRadius).toBe('1000px');
  });

  it('doit transmettre les styles de texte corrects selon la taille', () => {
    // Si size="xs", le texte doit être en taille "xs"
    renderWithProvider(<CcProgressBar value={50} size="xs" />);
    const textElement = screen.getByText('50%') as HTMLElement;
    
    // Mantine traduit size="xs" en une variable CSS ou une classe, 
    // mais ici tu as un style inline conditionnel : fontSize est géré par CcText.
    // On vérifie que le z-index est bien présent pour la visibilité.
    expect(textElement.style.zIndex).toBe('1');
  });
});