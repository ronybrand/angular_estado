import { environment } from '../../../environments/environment';
import { ehRequisicaoDoAiAgent } from './eh-requisicao-do-ai-agent';

describe('ehRequisicaoDoAiAgent', () => {
  it('should match the /ask endpoint exactly', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.apiUrl}/ask`)).toBe(true);
  });

  it('should match /ask with a query string', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.apiUrl}/ask?debug=true`)).toBe(true);
  });

  it('should not match a URL that merely shares the /ask prefix', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.apiUrl}/asking`)).toBe(false);
  });

  it('should not match a request against the estado API', () => {
    expect(ehRequisicaoDoAiAgent(`${environment.apiUrl}/estado/`)).toBe(false);
  });
});
