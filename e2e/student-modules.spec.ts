import { test, expect } from '@playwright/test';

// Simulation de la session de l'étudiant avant chaque test
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem(
      'cc_auth_user',
      JSON.stringify({ userId: 101, role: 'student' })
    );
  });
});

test.describe('Student Modules Page', () => {

  const mockModules = [
    {
      id: 1,
      title: 'Avançado de React',
      subTitle: 'Front-end',
      description: 'Développement de composants complexes.',
      teacher: { id: 10, firstName: 'Thomas', lastName: 'Rousseau', email: 't.rousseau@school.com' },
      tags: ['Front-end', 'UI/UX'],
      submodules: [{ id: 20, title: 'Hooks Avancés', description: 'Custom hooks', questionsCount: 4 }]
    },
    {
      id: 2,
      title: 'Bases de Docker',
      subTitle: 'Devops',
      description: 'Comprendre les conteneurs.',
      teacher: { id: 11, firstName: 'Sarah', lastName: 'Connor', email: 's.connor@school.com' },
      tags: ['Devops'],
      submodules: []
    }
  ];

  test('devrait afficher la liste des modules disponibles', async ({ page }) => {
    // Intercepter la requête de chargement des modules
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockModules) });
    });

    await page.goto('/student/modules'); // Modifiez l'URL selon votre routage

    // Vérifier les titres des modules
    await expect(page.getByRole('heading', { name: 'Avançado de React' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bases de Docker' })).toBeVisible();

    // Vérifier le compteur de sous-modules
    await expect(page.getByText('1 submodule', { exact: false })).toBeVisible();
    await expect(page.getByText('0 submodules')).toBeVisible();
  });

  test('devrait ouvrir le modal et appliquer un filtre', async ({ page }) => {
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockModules) });
    });

    await page.goto('/student/modules');

    // Ouvrir le panneau de filtrage
    await page.getByRole('button', { name: 'Filter' }).click();

    // Vérifier la présence des suggestions générées automatiquement par le useMemo
    await expect(page.getByText('Thomas Rousseau')).toBeVisible(); // Suggestion prof
    await expect(page.getByText('Devops')).toBeVisible();          // Suggestion tag

    // Saisir un filtre dans le champ de recherche
    const filterInput = page.getByPlaceholder('Search by title, subtitle, tag or teacher');
    await filterInput.fill('Docker');

    // Cliquer sur le bouton de validation "Search" du modal
    await page.getByRole('button', { name: 'Search' }).click();

    // Vérifier que le filtre a masqué le module React et gardé Docker
    await expect(page.getByRole('heading', { name: 'Bases de Docker' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Avançado de React' })).toBeHidden();

    // Cliquer sur "Clear" pour réinitialiser la vue
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByRole('heading', { name: 'Avançado de React' })).toBeVisible();
  });

  test('devrait afficher l\'état vide si aucun module n\'est renvoyé', async ({ page }) => {
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/student/modules');

    // Vérifier l'empty state personnalisé du composant
    await expect(page.getByText('No module available yet')).toBeVisible();
  });

  test('devrait retourner à l\'accueil au clic sur le bouton Back', async ({ page }) => {
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/student/modules');

    // Clic sur le bouton Back
    await page.getByRole('button', { name: 'Back' }).click();

    // Vérification de la redirection
    await expect(page).toHaveURL(/\/student$/);
  });
});