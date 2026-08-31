import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('redireciona para /login ao tentar criar estado sem autenticação', async ({ page }) => {
    await page.goto('/estado/criar');

    await expect(page).toHaveURL('/login');
  });

  test('redireciona para /login ao tentar editar estado sem autenticação', async ({ page }) => {
    await page.goto('/estado/editar/1');

    await expect(page).toHaveURL('/login');
  });

  test('lista de estados continua acessível sem autenticação', async ({ page }) => {
    await page.route('**/api/estado/', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );

    await page.goto('/');

    await expect(page).toHaveURL('/');
  });

  test('login válido guarda o token e navega para a lista', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'token-de-teste', expiresInSeconds: 3600 }),
      }),
    );

    await page.goto('/login');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('senha-correta');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL('/');
    const token = await page.evaluate(() => localStorage.getItem('estado_jwt'));
    expect(token).toBe('token-de-teste');
  });

  test('login inválido exibe mensagem de erro e não navega', async ({ page }) => {
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
    await expect(page).toHaveURL('/login');
  });

  test('token expirado é tratado como não autenticado', async ({ page }) => {
    await page.addInitScript(
      ([chave, valor]) => {
        localStorage.setItem(chave, valor);
      },
      [
        'estado_jwt',
        `cabecalho.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 })).toString('base64url')}.assinatura`,
      ],
    );

    await page.goto('/estado/criar');

    await expect(page).toHaveURL('/login');
  });
});
