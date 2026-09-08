import type { Page, Route } from '@playwright/test';

export interface EstadoFixture {
  id: number;
  nome: string;
  sigla: string;
  dataHoraCadastro: string;
  dataHoraUltimaAtualizacao: string;
}

export const ESTADOS: EstadoFixture[] = [
  {
    id: 1,
    nome: 'São Paulo',
    sigla: 'SP',
    dataHoraCadastro: '2026-01-10T09:00:00',
    dataHoraUltimaAtualizacao: '2026-01-10T09:00:00',
  },
  {
    id: 2,
    nome: 'Rio de Janeiro',
    sigla: 'RJ',
    dataHoraCadastro: '2026-01-11T09:00:00',
    dataHoraUltimaAtualizacao: '2026-01-11T09:00:00',
  },
];

/**
 * Fulfills a route after `delayMs`, so the response lands after Angular's
 * first render cycle — the exact timing under which the OnPush-default
 * regression (data assigned but view never updated) used to reproduce.
 */
export async function fulfillDelayed(
  route: Route,
  body: unknown,
  status = 200,
  delayMs = 300,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

// Backend so tem GET /estado/paginado (o GET /estado sem paginacao foi
// removido, ver ADR 0018 no repo estado) - toda resposta de listagem segue
// o envelope { content, page } do Spring Data, nao um array puro.
export function paginaDe(estados: EstadoFixture[]): unknown {
  return {
    content: estados,
    page: { size: 100, number: 0, totalElements: estados.length, totalPages: 1 },
  };
}

export function mockListaEstados(
  page: Page,
  estados: EstadoFixture[] = ESTADOS,
  delayMs = 300,
): Promise<void> {
  return page.route('**/api/estado/paginado**', (route) => {
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }
    return fulfillDelayed(route, paginaDe(estados), undefined, delayMs);
  });
}

export function mockGetEstado(page: Page, estado: EstadoFixture, delayMs = 300): Promise<void> {
  return page.route(`**/api/estado/${estado.id}`, (route) => {
    if (route.request().method() !== 'GET') {
      return route.fallback();
    }
    return fulfillDelayed(route, estado, undefined, delayMs);
  });
}

export function mockAddEstado(page: Page, status = 200): Promise<void> {
  return page.route('**/api/estado/', (route) => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }
    const body = status === 200 ? (route.request().postData() ?? '{}') : '{}';
    return route.fulfill({ status, contentType: 'application/json', body });
  });
}

// PUT vai pro id na URL agora (PUT /estado/{id}, ver ADR 0018 no repo
// estado), nao mais pra raiz `/estado/`.
export function mockAtualizaEstado(page: Page, id: number, status = 200): Promise<void> {
  return page.route(`**/api/estado/${id}`, (route) => {
    if (route.request().method() !== 'PUT') {
      return route.fallback();
    }
    const body = status === 200 ? (route.request().postData() ?? '{}') : '{}';
    return route.fulfill({ status, contentType: 'application/json', body });
  });
}

export function mockDeletaEstado(page: Page, id: number, onDelete?: () => void): Promise<void> {
  return page.route(`**/api/estado/${id}`, (route) => {
    if (route.request().method() !== 'DELETE') {
      return route.fallback();
    }
    onDelete?.();
    return route.fulfill({ status: 200 });
  });
}

export function mockErro(
  page: Page,
  urlPattern: string,
  status: number,
  method?: string,
): Promise<void> {
  return page.route(urlPattern, (route) => {
    if (method && route.request().method() !== method) {
      return route.fallback();
    }
    return route.fulfill({ status, contentType: 'application/json', body: '{}' });
  });
}
