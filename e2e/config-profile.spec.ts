import { test, expect } from '@playwright/test';

test.describe('Config Profile Page', () => {

  test.beforeEach(async ({ page }) => {
    // Intercepter les requêtes initiales de chargement des listes déroulantes (étudiant)
    await page.route('**/auth/programs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(['CDA', 'BTS SIO'])
      });
    });

    await page.route('**/auth/study-levels', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(['2025-2026', '2026-2027'])
      });
    });
  });

  test('devrait charger les options et permettre de remplir le profil en tant qu\'étudiant', async ({ page }) => {
    // Injecter le state de react-router-dom à la navigation
    await page.goto('/config-profile');
    // Note: Pour injecter un state de navigation réel en Playwright, on passe souvent par un mock de window.history
    await page.evaluate(() => {
      const state = { userId: 42, email: 'student@school.com' };
      window.history.replaceState({ usr: state }, '');
    });
    await page.reload(); // Recharger pour appliquer le state injecté

    // Vérifier l'affichage du sous-titre lié à l'email
    await expect(page.getByText('Continue your setup for student@school.com')).toBeVisible();

    // Remplir le formulaire
    await page.getByPlaceholder('Firstname').fill('John');
    await page.getByPlaceholder('Lastname').fill('Doe');
    await page.getByPlaceholder('Phone number').fill('0601020304');

    // Vérifier et interagir avec les Select de Mantine
    const programSelect = page.getByPlaceholder('Program');
    await programSelect.click();
    await page.getByRole('option', { name: 'CDA' }).click();

    const levelSelect = page.getByPlaceholder('Study level');
    await levelSelect.click();
    await page.getByRole('option', { name: '2025-2026' }).click();

    // Mock de la soumission réussie du profil
    await page.route('**/auth/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ role: 'student' })
      });
    });

    // Utiliser les timers virtuels de Playwright (ou laisser le setTimeout de 3s s'exécuter)
    await page.getByRole('button', { name: 'Next' }).click();

    // Vérifier le passage à l'écran 'verification'
    await expect(page.getByRole('heading', { name: 'Your Account Is Almost Ready!' })).toBeVisible();

    // Attendre la transition automatique vers l'écran 'completed' (setTimeout de 3000ms dans le code)
await expect(page.getByRole('heading', { name: 'Congratulations !' })).toBeAttached({ timeout: 4000 });

    // Cliquer sur Start et vérifier la redirection vers /student
    await page.getByRole('button', { name: 'Start !' }).click();
    await expect(page).toHaveURL(/\/student$/);
  });

  test('devrait masquer les sélections de programme si la case "I am a teacher" est cochée', async ({ page }) => {
    await page.goto('/config-profile');

    // Par défaut, les Select sont visibles
    await expect(page.getByPlaceholder('Program')).toBeVisible();

    // Cocher la case Enseignant
    await page.getByLabel('I am a teacher').check();

    // Les Select doivent disparaître conformément à l'affichage conditionnel !isTeacher
    await expect(page.getByPlaceholder('Program')).toBeHidden();
    await expect(page.getByPlaceholder('Study level')).toBeHidden();
    await expect(page.getByText('Teacher accounts can continue without program selection')).toBeVisible();
  });

  test('devrait afficher une erreur si l\'enregistrement du profil échoue', async ({ page }) => {
    await page.goto('/config-profile');
    await page.evaluate(() => {
      window.history.replaceState({ usr: { userId: 42 } }, '');
    });
    await page.reload();

    await page.route('**/auth/profile', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Le numéro de téléphone est invalide' })
      });
    });

    await page.getByPlaceholder('Firstname').fill('John');
    await page.getByPlaceholder('Lastname').fill('Doe');
    await page.getByRole('button', { name: 'Next' }).click();

    // Validation du message d'erreur renvoyé par le backend
    await expect(page.getByText('Le numéro de téléphone est invalide')).toBeVisible();
  });
});