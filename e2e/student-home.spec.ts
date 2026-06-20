import { test, expect } from '@playwright/test';

// Configuration initiale : simulation de la session de l'étudiant avant chaque test
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Simule la structure attendue par votre fonction getAuthUser()
    window.sessionStorage.setItem(
      'cc_auth_user', // Ajustez la clé si getAuthUser utilise un autre nom en sessionStorage
      JSON.stringify({ userId: 101, role: 'student' })
    );
  });
});

test.describe('Student Home Dashboard', () => {

  test('devrait charger et afficher correctement la progression et les sous-modules', async ({ page }) => {
    // Intercepter l'appel API des modules de l'étudiant
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            title: 'React.js',
            subTitle: 'Front-end',
            description: 'Maîtriser les hooks',
            tags: ['Front-end'],
            teacher: { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'j.dupont@test.com' },
            submodules: [
              {
                id: 10,
                title: 'Introduction aux Hooks',
                description: 'Comprendre useState et useEffect',
                questionsCount: 5
              }
            ]
          }
        ])
      });
    });

    // Navigation vers la page d'accueil de l'étudiant
    await page.goto('/student');

    // 1. Vérification de la section Progression (Hero)
    await expect(page.getByRole('heading', { name: 'Progression' })).toBeVisible();
    await expect(page.getByText('React.js')).toBeVisible();

    // 2. Vérification de la section Submodules et de la carte associée
    await expect(page.getByRole('heading', { name: 'Submodules' })).toBeVisible();
    
    const submoduleCard = page.locator('article, div').filter({ hasText: 'Introduction aux Hooks' });
    await expect(submoduleCard).toBeVisible();
    await expect(submoduleCard.getByText('Comprendre useState et useEffect')).toBeVisible();
    await expect(submoduleCard.getByText('5 questions')).toBeVisible();
  });

  test('devrait rediriger vers la page des modules au clic sur le bouton Continue', async ({ page }) => {
    // Injection d'une réponse vide pour éviter de bloquer sur le chargement
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/student');

    // Clic sur le bouton de redirection "Continue"
    await page.getByRole('button', { name: 'Continue' }).click();

    // Vérifier que l'URL a bien changé vers la page des modules
    await expect(page).toHaveURL(/\/student\/modules/);
  });

  test('devrait afficher un message d\'erreur si l\'API échoue', async ({ page }) => {
    // Simuler une panne du serveur (Erreur 500)
    await page.route('**/student-modules/student/101', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json'
      });
    });

    await page.goto('/student');

    // Vérifier l'affichage du message d'erreur géré par le catch {}
    await expect(page.getByText('Impossible de charger les modules')).toBeVisible();
  });

  test('devrait afficher une erreur si l\'utilisateur n\'est pas connecté', async ({ page }) => {
    // Vider le sessionStorage avant ce test précis pour simuler un utilisateur introuvable
    await page.context().addInitScript(() => {
      window.sessionStorage.clear();
    });

    await page.goto('/student');

    // Vérifier la présence du message d'erreur d'authentification
    await expect(page.getByText('Utilisateur introuvable')).toBeVisible();
  });
});