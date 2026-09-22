import { environment } from '../../../environments/environment';

// /ask agora vive atras do proprio backend "estado" (BFF, guarda a
// ASK_API_KEY server-side - ver AskProxyController), mesmo host de
// environment.apiUrl. Boundary-safe check (nao so startsWith): uma URL
// vizinha tipo apiUrl+"/asking" nao deve ser tratada como se fosse o ai-agent.
export function ehRequisicaoDoAiAgent(url: string): boolean {
  const askUrl = `${environment.apiUrl}/ask`;
  return url === askUrl || url.startsWith(`${askUrl}?`);
}
