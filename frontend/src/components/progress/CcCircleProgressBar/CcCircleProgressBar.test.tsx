/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MantineProvider } from '@mantine/core';
import { CcCircleProgress } from './CcCircleProgressBar.component';

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

describe('CcCircleProgress Component', () => {
  it('doit afficher la valeur en pourcentage correctement', () => {
    renderWithProvider(<CcCircleProgress value={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('doit afficher le label si fourni', () => {
    renderWithProvider(<CcCircleProgress value={50} label="Progression" />);
    expect(screen.getByText('Progression')).toBeInTheDocument();
  });

  it('doit appliquer les dimensions correctes au conteneur', () => {
    const size = 200;
    const { container } = renderWithProvider(<CcCircleProgress value={50} size={size} />);
    // Le premier enfant de la Box peut être un wrapper Mantine, on cherche la div avec la taille
    const rootBox = container.querySelector(`div[style*="width: ${size}px"]`) as HTMLElement;
    
    expect(rootBox).toBeInTheDocument();
    expect(rootBox.style.width).toBe(`${size}px`);
    expect(rootBox.style.height).toBe(`${size}px`);
  });

  it('doit calculer le conic-gradient en fonction de la valeur', () => {
    const value = 50;
    const expectedAngle = 180;
    const { container } = renderWithProvider(<CcCircleProgress value={value} />);
    
    // On cherche la div qui possède le background conic-gradient
    const allDivs = Array.from(container.querySelectorAll('div'));
    const progressCircle = allDivs.find(div => div.style.background.includes('conic-gradient')) as HTMLElement;
    
    expect(progressCircle).toBeDefined();
    expect(progressCircle.style.background).toContain(`${expectedAngle}deg`);
  });

  it('doit ajuster la taille de la police en fonction de la prop size', () => {
    const size = 100;
    renderWithProvider(<CcCircleProgress value={50} size={size} />);
    const valueSpan = screen.getByText('50%') as HTMLElement;
    expect(valueSpan.style.fontSize).toBe('25px'); // 100 / 4
  });

  it('doit appliquer le masque radial pour créer l\'effet d\'anneau', () => {
    const size = 100;
    const thickness = 10;
    const expectedRadius = 40;
    const { container } = renderWithProvider(<CcCircleProgress value={50} thickness={thickness} size={size} />);
    
    const allDivs = Array.from(container.querySelectorAll('div'));
    const progressCircle = allDivs.find(div => div.style.background.includes('conic-gradient')) as HTMLElement;

    // JSDOM ne remplit pas toujours .style.mask, on vérifie l'attribut style brut
    const styleAttr = progressCircle.getAttribute('style') || '';
    expect(styleAttr).toContain(`${expectedRadius}px`);
  });

  it('doit appliquer les styles de dégradé au texte', () => {
    renderWithProvider(<CcCircleProgress value={50} />);
    const valueSpan = screen.getByText('50%') as HTMLElement;

    // On vérifie directement via l'objet style pour les propriétés Webkit
    expect(valueSpan.style.webkitBackgroundClip).toBe('text');
    expect(valueSpan.style.webkitTextFillColor).toBe('transparent');
  });
});