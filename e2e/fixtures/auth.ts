import type { Page } from '@playwright/test';

const CHAVE_TOKEN = 'estado_jwt';

/**
 * Seeds a fake-but-well-shaped JWT (future `exp`, no real signature) into
 * localStorage before the page's own scripts run, so authGuard's
 * isAuthenticated() check passes without a real backend login. Safe for e2e:
 * these specs mock every network call already (see fixtures/estados.ts), and
 * the guard only decodes the exp claim client-side - it never verifies the
 * signature (the backend, not this guard, is what actually enforces auth on
 * real requests).
 */
export async function autenticado(page: Page): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const token = `cabecalho.${payload}.assinatura`;

  await page.addInitScript(
    ([chave, valor]) => {
      localStorage.setItem(chave, valor);
    },
    [CHAVE_TOKEN, token],
  );
}
