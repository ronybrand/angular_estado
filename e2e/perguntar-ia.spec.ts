import { test, expect } from '@playwright/test';

// O componente detecta idioma do navegador (window.navigator.language) como
// fallback quando nao ha ?lang= na URL - forçar pt-BR deixa o estado inicial
// deterministico independente do locale da maquina/CI rodando os testes.
test.use({ locale: 'pt-BR' });

function mockAsk(page: import('@playwright/test').Page, body: unknown, status = 200) {
  return page.route('**/api/ask', (route) => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }
    return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

test.describe('Pergunte à IA', () => {
  test('faz uma pergunta e exibe a resposta', async ({ page }) => {
    await mockAsk(page, { answer: 'O Brasil tem 26 estados e o Distrito Federal.' });
    await page.goto('/perguntar-ia');

    await page.getByTestId('pergunta-textarea').fill('Quantos estados tem o Brasil?');
    await page.getByTestId('perguntar-button').click();

    await expect(page.getByTestId('resposta')).toContainText('26 estados');
  });

  test('alterna pra ingles e os textos da pagina mudam', async ({ page }) => {
    await page.goto('/perguntar-ia');

    await expect(page.getByTestId('perguntar-button')).toHaveText('Perguntar');

    await page.getByTestId('lang-toggle').click();

    await expect(page.getByTestId('perguntar-button')).toHaveText('Ask');
    await expect(page.getByTestId('lang-toggle')).toHaveText('PT');
  });

  // Regressao do bug corrigido no PR #123 (angular_estado): extraiMensagemErro
  // sempre priorizava a mensagem crua do backend (sempre em PT) sobre o
  // fallback traduzido, vazando portugues numa pagina em modo ingles. O teste
  // unitario que "cobria" isso usava um erro sem corpo, entao nunca exercitava
  // o cenario real (backend respondendo com uma message de verdade).
  test('mostra o fallback em ingles, nao a mensagem crua do backend em PT, quando a pagina esta em EN', async ({
    page,
  }) => {
    await mockAsk(page, { message: 'Limite de requisicoes excedido' }, 429);
    await page.goto('/perguntar-ia');

    await page.getByTestId('lang-toggle').click();
    await page.getByTestId('pergunta-textarea').fill('How many states are there?');
    await page.getByTestId('perguntar-button').click();

    await expect(page.getByRole('alert')).toContainText(
      'Failed to reach the assistant. Please try again shortly.',
    );
    await expect(page.getByRole('alert')).not.toContainText('Limite de requisicoes');
  });

  test('mostra a mensagem crua do backend em PT (comportamento padrao da pagina)', async ({
    page,
  }) => {
    await mockAsk(page, { message: 'Limite de requisicoes excedido' }, 429);
    await page.goto('/perguntar-ia');

    await page.getByTestId('pergunta-textarea').fill('Quantos estados tem o Brasil?');
    await page.getByTestId('perguntar-button').click();

    await expect(page.getByRole('alert')).toContainText('Limite de requisicoes excedido');
  });

  test('desabilita o botao enquanto processa e reabilita apos a resposta', async ({ page }) => {
    await page.route('**/api/ask', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ answer: 'Resposta.' }),
      });
    });
    await page.goto('/perguntar-ia');

    await page.getByTestId('pergunta-textarea').fill('Pergunta qualquer');
    await page.getByTestId('perguntar-button').click();

    await expect(page.getByTestId('perguntar-button')).toBeDisabled();
    await expect(page.getByTestId('resposta')).toBeVisible();
    await expect(page.getByTestId('perguntar-button')).toBeEnabled();
  });
});
