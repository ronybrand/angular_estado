import { test, expect } from '@playwright/test';
import { mockAddEstado, mockErro } from './fixtures/estados';

test.describe('Criar estado', () => {
  test('cria um novo estado e volta para a lista', async ({ page }) => {
    await mockAddEstado(page);

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
    await mockErro(page, '**/api/estado/', 500, 'POST');

    await page.goto('/estado/criar');
    await page.locator('#sigla').fill('MG');
    await page.locator('#nome').fill('Minas Gerais');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.getByRole('alert')).toContainText('Falha ao adicionar estado.');
  });
});
