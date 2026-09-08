// Exportada (nao so um const privado) pra e2e/fixtures/auth.ts poder
// semear o token com a mesma chave em vez de duplicar o literal - achado
// de code review, risco de dessincronizar silenciosamente se a chave mudar.
export const CHAVE_TOKEN = 'estado_jwt';

export function getToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function setToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function clearToken(): void {
  localStorage.removeItem(CHAVE_TOKEN);
}
