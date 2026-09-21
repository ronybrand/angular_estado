import { environment } from '../../../environments/environment';
import { ehRequisicaoDoAiAgent } from './eh-requisicao-do-ai-agent';

describe('ehRequisicaoDoAiAgent', () => {
  it('should match the aiApiUrl itself with no trailing path', () => {
    expect(ehRequisicaoDoAiAgent(environment.aiApiUrl)).toBe(true);
  });

  it('should match a path under aiApiUrl', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.aiApiUrl}/ask`)).toBe(true);
  });

  it('should not match a URL that merely shares the aiApiUrl prefix', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.aiApiUrl}evil.example.com/recurso`)).toBe(false);
  });

  it('should not match a request against the estado API', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.apiUrl}/estado/`)).toBe(false);
  });
});
