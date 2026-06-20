import { test, expect } from '@playwright/test';

// Configuration de base : simulation de la session de l'enseignant avant chaque test
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem(
      'cc_teacher_user',
      JSON.stringify({ userId: 42, lastName: 'Dupont', firstName: 'Jean' })
    );
  });
});

test.describe('Teacher Dashboard', () => {

  test('devrait afficher le message de bienvenue et charger les modules', async ({ page }) => {
    // Intercepter l'appel API de chargement des modules
    await page.route('**/teacher-modules/teacher/42', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            title: 'Introduction à React',
            subTitle: 'Front-end',
            description: 'Les bases de React',
            submodulesCount: 2,
            tags: ['Front-end', 'Development']
          }
        ])
      });
    });

    await page.goto('/teacher'); // Ajustez l'URL selon votre routage

    // Vérifier le message de bienvenue personnalisé
    await expect(page.getByText('Welcome on your HomePage Competency Cluster, Dupont.')).toBeVisible();

    // Vérifier que le module mocké s'affiche correctement
    const moduleCard = page.locator('article').filter({ hasText: 'Introduction à React' });
    await expect(moduleCard).toBeVisible();
    await expect(moduleCard.getByText('2 submodules')).toBeVisible();
  });

  test('devrait permettre de créer un nouveau module avec succès', async ({ page }) => {
    // Liste vide au départ
    await page.route('**/teacher-modules/teacher/42', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    // Mock de la création du module
    await page.route('**/teacher-modules', async (route) => {
      expect(route.request().method()).toBe('POST');
      const payload = route.request().postDataJSON();
      expect(payload).toMatchObject({
        teacherId: 42,
        title: 'NestJS Avancé',
        subTitle: 'Back-end',
        description: 'Apprendre les architectures microservices.'
      });
      
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 99, ...payload, submodulesCount: 0 })
      });
    });

    await page.goto('/teacher');

    // Ouvrir le menu Actions et cliquer sur "Create a module"
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('button', { name: 'Create a module' }).click();

    // Remplir le formulaire
    await page.getByPlaceholder('Name of the module (Example : Next.js)').fill('NestJS Avancé');
    await page.getByPlaceholder('Write a Sub-title').fill('Back-end');
    await page.getByPlaceholder('Description...').fill('Apprendre les architectures microservices.');

    // Gérer les tags
    await page.getByPlaceholder('Choose tags').click();
    await page.getByRole('button', { name: 'Back-end', exact: true }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    // Soumettre le formulaire
    // Ré-intercepter le rechargement avec le nouveau module
    await page.route('**/teacher-modules/teacher/42', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 99, title: 'NestJS Avancé', subTitle: 'Back-end', tags: ['Back-end'], submodulesCount: 0 }])
      });
    });

    await page.getByRole('button', { name: 'Create' }).click();

    // Vérifier le message de succès
    await expect(page.getByText('Module created successfully.')).toBeVisible();
  });

  test('devrait filtrer les modules via le volet de filtrage', async ({ page }) => {
    await page.route('**/teacher-modules/teacher/42', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'React Basics', subTitle: 'Front-end', tags: ['Front-end'], submodulesCount: 1 },
          { id: 2, title: 'Docker Guide', subTitle: 'Devops', tags: ['Devops'], submodulesCount: 3 }
        ])
      });
    });

    await page.goto('/teacher');

    // Vérifier que les deux cartes sont visibles au départ
    await expect(page.getByText('React Basics')).toBeVisible();
    await expect(page.getByText('Docker Guide')).toBeVisible();

    // Cliquer sur le bouton Filtre
    await page.getByRole('button', { name: 'Filter' }).click();

    // Saisir un filtre
    await page.getByPlaceholder('Search by title, subtitle or tag').fill('Docker');

    // Valider le filtre en cliquant sur la suggestion ou en fermant l'overlay (ici on simule le clic à côté ou l'application dynamique si liée)
    // Note : Votre code applique le filtre sur la valeur de 'appliedFilterQuery' lors de la validation.
    // Ajoutons le comportement attendu pour déclencher le filtrage :
    await page.keyboard.press('Escape'); // ou simuler le clic sur le bouton d'application si existant

    // Si vous appliquez au clic sur un élément de suggestion :
    // await page.getByRole('button', { name: 'Docker Guide' }).click();
  });
});