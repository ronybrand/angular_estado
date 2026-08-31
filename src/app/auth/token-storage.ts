const CHAVE_TOKEN = 'estado_jwt';

export function getToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function setToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function clearToken(): void {
  localStorage.removeItem(CHAVE_TOKEN);
}
