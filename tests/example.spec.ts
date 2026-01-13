import { test, expect } from '@playwright/test';

test.describe('Funcionalidad Core', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. Verificar Dark Mode
  test('Debe alternar el modo oscuro correctamente', async ({ page }) => {
    // Localizamos el botón por la clase que le pusimos (no por ID, para que funcione en ambos)
    // Usamos .first() porque en desktop hay 2 botones en el DOM (uno oculto, uno visible)
    // O mejor, filtramos por visibilidad si es necesario, pero .first() servirá para la prueba funcional base.
    const toggleBtn = page.locator('.theme-toggle-btn:visible');
    // Verificamos estado inicial (suponiendo claro por defecto o por sistema)
    // Nota: Playwright a veces arranca con light por defecto.

    // Click en el toggle
    await toggleBtn.click();

    // Verificación: El HTML debe tener la clase 'dark'
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Verificación de persistencia: Recargamos la página
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Click de nuevo para volver a claro
    await toggleBtn.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  // 2. Verificar Menú Móvil (Solo en viewport móvil)
  test('Menú móvil debe abrirse, cerrarse y navegar', async ({ page, isMobile }) => {
    // Este test solo corre si el proyecto es móvil
    if (!isMobile) return;

    const menuBtn = page.locator('#mobile-menu-btn');
    const menu = page.locator('#mobile-menu');
    const projectsLink = menu.getByRole('link', { name: 'Proyectos' });

    // A. El menú debe estar oculto al principio
    await expect(menu).toBeHidden();

    // B. Al hacer click, debe ser visible
    await menuBtn.click();
    await expect(menu).toBeVisible();

    // C. Al hacer click en un enlace, debe navegar Y cerrarse el menú
    await projectsLink.click();

    // Verificar URL
    await expect(page).toHaveURL('/projects');

    // Verificar que el menú se cerró (UX fix que hicimos)
    await expect(menu).toBeHidden();
  });

  // 3. Verificar Navegación Desktop
  test('Navegación Desktop funciona', async ({ page, isMobile }) => {
    if (isMobile) return;

    // Click en "Proyectos"
    await page.getByRole('navigation').getByRole('link', { name: 'Proyectos' }).click();
    await expect(page).toHaveURL('/projects');

    // Verificar vuelta a Inicio
    await page.getByRole('navigation').getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL('/');
  });

  // 4. Test de Resiliencia de JS (Critical for View Transitions)
  // Verifica que los scripts se reactivan correctamente tras navegar
  test('La interactividad persiste tras la navegación (View Transitions)', async ({ page }) => {
    // 1. Empezamos en Home y activamos Dark Mode
    const toggleBtn = page.locator('.theme-toggle-btn:visible');
    await toggleBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // 2. Navegamos a Proyectos
    // (Usamos el link visible según el dispositivo)
    if (await page.getByRole('navigation').isVisible()) {
      await page.getByRole('navigation').getByRole('link', { name: 'Proyectos' }).click();
    } else {
      // Mobile flow
      await page.locator('#mobile-menu-btn').click();
      await page.locator('#mobile-menu').getByRole('link', { name: 'Proyectos' }).click();
    }

    // 3. Verificamos que el Dark Mode SIGUE activo (Persistencia)
    await expect(page.locator('html')).toHaveClass(/dark/);

    // 4. INTENTAMOS desactivarlo desde la nueva página (Prueba de Fuego)
    // Si el script no se recargó con 'astro:page-load', esto fallará
    await toggleBtn.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  // 5. Verificación SEO básica
  // tests/example.spec.ts

  test('Las metaetiquetas de título cambian al navegar', async ({ page }) => {
    // Home Title
    // ANTES: await expect(page).toHaveTitle(/Portfolio|Inicio/);
    // AHORA: Ponemos el título real que definimos en index.astro
    await expect(page).toHaveTitle(/Christian Oller | Desarrollador de Software/);

    // Navigate to Projects
    await page.goto('/projects');

    // Projects Title (Asegúrate de que este coincida también, debería ser "Proyectos")
    await expect(page).toHaveTitle(/Proyectos/);
  });
});
