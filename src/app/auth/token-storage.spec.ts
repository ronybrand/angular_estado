import { describe, it, expect, beforeEach } from 'vitest';
import { CHAVE_TOKEN, getToken, setToken, clearToken } from './token-storage';

describe('token-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getToken retorna null quando nao ha token salvo', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken salva o token em localStorage sob a chave esperada', () => {
    setToken('meu-token');

    expect(localStorage.getItem(CHAVE_TOKEN)).toBe('meu-token');
  });

  it('getToken retorna o token salvo por setToken', () => {
    setToken('meu-token');

    expect(getToken()).toBe('meu-token');
  });

  it('clearToken remove o token salvo', () => {
    setToken('meu-token');

    clearToken();

    expect(getToken()).toBeNull();
  });

  it('clearToken nao lanca erro quando nao ha token salvo', () => {
    expect(() => clearToken()).not.toThrow();
  });
});
