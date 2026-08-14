import { test, expect } from '@playwright/test';

test.describe('Criar estado', () => {
  test('cria um novo estado e volta para a lista', async ({ page }) => {
    await page.route('**/api/estado/', (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback();
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: route.request().postData() ?? '{}',
      });
    });

    await page.goto('/estado/criar');
    await page.locator('#sigla').fill('MG');
    await page.locator('#nome').fill('Minas Gerais');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page).toHaveURL('/');
  });

  test('mantém o botão desabilitado enquanto o formulário é inválido', async ({ page }) => {
    await page.goto('/estado/criar');

    await expect(page.getByRole('button', { name: 'Salvar' })).toBeDisabled();

    await page.locator('#sigla').fill('MG');
    await page.locator('#nome').fill('Minas Gerais');

    await expect(page.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });

  test('exibe mensagem de erro quando a criação falha', async ({ page }) => {
    await page.route('**/api/estado/', (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback();
      }
      return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/estado/criar');
    await page.locator('#sigla').fill('MG');
    await page.locator('#nome').fill('Minas Gerais');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.getByRole('alert')).toContainText('Falha ao adicionar estado.');
  });
});
