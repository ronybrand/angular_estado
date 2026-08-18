import { test, expect } from '@playwright/test';
import { ESTADOS, mockListaEstados, mockDeletaEstado, mockErro } from './fixtures/estados';

test.describe('Lista de estados', () => {
  test('exibe os estados assim que a resposta assíncrona chega, após o primeiro ciclo de renderização', async ({
    page,
  }) => {
    await mockListaEstados(page, ESTADOS, 500);
    await page.goto('/');

    // Right after navigation the request hasn't resolved yet: spinner is up,
    // this is the state that existed after Angular's first render pass.
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('table')).not.toBeVisible();

    // Once the delayed HTTP response lands, the view must update to reflect it.
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('status')).not.toBeVisible();
    await expect(page.getByRole('row', { name: /SP.*São Paulo/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /RJ.*Rio de Janeiro/ })).toBeVisible();
  });

  test('exibe mensagem quando não há estados cadastrados', async ({ page }) => {
    await mockListaEstados(page, [], 100);
    await page.goto('/');

    await expect(page.getByText('Nenhum estado cadastrado.')).toBeVisible();
  });

  test('exibe mensagem de erro quando a busca falha', async ({ page }) => {
    await mockErro(page, '**/api/estado/', 500);
    await page.goto('/');

    await expect(page.getByRole('alert')).toContainText('Falha ao buscar estados.');
  });

  test('exclui um estado após confirmação', async ({ page }) => {
    let requestedDelete = false;
    let estados = [...ESTADOS];
    await page.route('**/api/estado/', (route) => {
      if (route.request().method() !== 'GET') {
        return route.fallback();
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(estados),
      });
    });
    await mockDeletaEstado(page, 1, () => {
      requestedDelete = true;
      estados = estados.filter((estado) => estado.id !== 1);
    });

    await page.goto('/');
    await expect(page.getByRole('table')).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Excluir SP' }).click();

    await expect(page.getByRole('row', { name: /SP.*São Paulo/ })).not.toBeVisible();
    expect(requestedDelete).toBe(true);
  });

  test('exibe mensagem de erro quando a exclusão falha, mantendo a linha na tabela', async ({
    page,
  }) => {
    await mockListaEstados(page, ESTADOS, 100);
    await mockErro(page, '**/api/estado/1', 500, 'DELETE');

    await page.goto('/');
    await expect(page.getByRole('table')).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Excluir SP' }).click();

    await expect(page.getByRole('alert')).toContainText('Falha ao deletar estado.');
    await expect(page.getByRole('row', { name: /SP.*São Paulo/ })).toBeVisible();
  });
});
