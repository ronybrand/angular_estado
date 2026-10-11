import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ESTADOS, mockListaEstados, mockGetEstado } from './fixtures/estados';
import { autenticado } from './fixtures/auth';

test.describe('Acessibilidade (axe-core, WCAG 2.1 A/AA)', () => {
  test('login não tem violações', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#username')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('login com erro exibido não tem violações', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Usuario ou senha invalidos' }),
      }),
    );

    await page.goto('/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('senha-errada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('alert')).toContainText('Usuario ou senha invalidos');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('lista de estados não tem violações', async ({ page }) => {
    await mockListaEstados(page, ESTADOS, 0);
    await page.goto('/');
    await expect(page.getByRole('table')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('modal de confirmação de exclusão não tem violações', async ({ page }) => {
    await mockListaEstados(page, ESTADOS, 0);
    await page.goto('/');
    await page.getByRole('button', { name: 'Excluir SP' }).click();
    await expect(page.getByRole('button', { name: 'Confirmar' })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('formulário de criação não tem violações', async ({ page }) => {
    await autenticado(page);
    await page.goto('/estado/criar');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('formulário de edição não tem violações', async ({ page }) => {
    await autenticado(page);
    const estado = ESTADOS[0];
    await mockGetEstado(page, estado, 0);
    await page.goto(`/estado/editar/${estado.id}`);
    await expect(page.locator('#sigla')).toHaveValue(estado.sigla);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('pergunte à IA não tem violações', async ({ page }) => {
    await page.goto('/perguntar-ia');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('pergunte à IA com resposta exibida não tem violações', async ({ page }) => {
    await page.route('**/api/ask', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ answer: 'O Brasil tem 26 estados e o Distrito Federal.' }),
      }),
    );
    await page.goto('/perguntar-ia');
    await page.getByTestId('pergunta-textarea').fill('Quantos estados tem o Brasil?');
    await page.getByTestId('perguntar-button').click();
    await expect(page.getByTestId('resposta')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });
});
