import { test, expect } from '@playwright/test';

test.describe('Authentication Page', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // Ajustez l'URL selon votre fichier de routage
  });

  test('devrait afficher le mode connexion par défaut et permettre de basculer vers le mode inscription', async ({ page }) => {
    // Vérifier l'affichage initial en mode Login
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Email *')).toBeVisible();
    await expect(page.getByPlaceholder('Password *')).toBeVisible();
    await expect(page.getByText('Forgot password')).toBeVisible();

    // Cliquer sur le bouton pour basculer vers le mode Register
    await page.getByRole('button', { name: 'Register' }).click();

    // Vérifier les changements d'interface pour l'inscription
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    await expect(page.getByPlaceholder('Confirm password *')).toBeVisible();
    await expect(page.getByLabel('I have read and accept the terms and conditions *')).toBeVisible();
    await expect(page.getByText('Forgot password')).toBeHidden();
  });

  test('devrait connecter un étudiant et rediriger vers l\'espace étudiant', async ({ page }) => {
    // Intercepter l'appel API de connexion
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 42,
          email: 'student@test.com',
          firstName: 'Alex',
          lastName: 'Doe',
          role: 'student'
        })
      });
    });

    // Remplir les champs
    await page.getByPlaceholder('Email *').fill('student@test.com');
    await page.getByPlaceholder('Password *').fill('password123');

    // Soumettre le formulaire
    await page.getByRole('button', { name: 'Login' }).click();

    // Vérifier la redirection vers l'espace étudiant
    await expect(page).toHaveURL(/\/student$/);
  });

  test('devrait connecter un enseignant et rediriger vers l\'espace enseignant', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 43, email: 'prof@test.com', role: 'teacher' })
      });
    });

    await page.getByPlaceholder('Email *').fill('prof@test.com');
    await page.getByPlaceholder('Password *').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Vérifier la redirection vers l'espace teacher
    await expect(page).toHaveURL(/\/teacher$/);
  });

  test('devrait afficher une erreur si la connexion échoue', async ({ page }) => {
    // Intercepter l'appel API et renvoyer une erreur 401
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Identifiants invalides' })
      });
    });

    await page.getByPlaceholder('Email *').fill('wrong@test.com');
    await page.getByPlaceholder('Password *').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // Vérifier l'affichage du message d'erreur renvoyé par l'API
    await expect(page.getByText('Identifiants invalides')).toBeVisible();
  });

  test('devrait bloquer l\'inscription si les conditions générales ne sont pas acceptées', async ({ page }) => {
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByPlaceholder('Email *').fill('new@test.com');
    await page.getByPlaceholder('Password *').fill('password123');
    await page.getByPlaceholder('Confirm password *').fill('password123');

    // Cliquer directement sur Register sans cocher la case
    await page.getByRole('button', { name: 'Register' }).click();

    // Vérifier l'erreur locale déclenchée par le code
    await expect(page.getByText('You must accept the terms and conditions to continue')).toBeVisible();
  });

  test('devrait procéder à l\'inscription et rediriger vers la configuration du profil', async ({ page }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          email: 'newuser@test.com',
          message: 'Inscription validée',
          profileCompleted: false
        })
      });
    });

    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByPlaceholder('Email *').fill('newuser@test.com');
    await page.getByPlaceholder('Password *').fill('password123');
    await page.getByPlaceholder('Confirm password *').fill('password123');
    
    // Cocher la case des termes
    await page.getByLabel('I have read and accept the terms and conditions *').check();

    await page.getByRole('button', { name: 'Register' }).click();

    // Vérifier la redirection vers la configuration de profil
    await expect(page).toHaveURL(/\/config-profile/);
  });
});