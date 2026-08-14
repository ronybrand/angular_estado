import { test, expect } from '@playwright/test';
import { ESTADOS, mockGetEstado, mockAtualizaEstado, mockErro } from './fixtures/estados';

test.describe('Editar estado', () => {
  test('preenche o formulário assim que o estado chega de forma assíncrona', async ({ page }) => {
    const estado = ESTADOS[0];
    await mockGetEstado(page, estado, 500);
    await page.goto(`/estado/editar/${estado.id}`);

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.locator('#sigla')).not.toBeVisible();

    await expect(page.locator('#sigla')).toHaveValue(estado.sigla);
    await expect(page.locator('#nome')).toHaveValue(estado.nome);
    await expect(page.getByRole('status')).not.toBeVisible();
  });

  test('atualiza o estado e volta para a lista', async ({ page }) => {
    const estado = ESTADOS[0];
    await mockGetEstado(page, estado, 100);
    await mockAtualizaEstado(page);

    await page.goto(`/estado/editar/${estado.id}`);
    await expect(page.locator('#nome')).toHaveValue(estado.nome);

    await page.locator('#nome').fill('São Paulo Atualizado');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page).toHaveURL('/');
  });

  test('exibe mensagem de erro quando a busca do estado falha', async ({ page }) => {
    await mockErro(page, '**/api/estado/1', 404);

    await page.goto('/estado/editar/1');

    await expect(page.getByRole('alert')).toContainText('Falha ao buscar estado.');
  });
});
