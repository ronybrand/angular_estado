import { environment } from '../../../environments/environment';

// Boundary-safe check (nao so startsWith): uma URL vizinha tipo
// aiApiUrl+"evil.com" nao deve ser tratada como se fosse o ai-agent.
export function ehRequisicaoDoAiAgent(url: string): boolean {
  return url === environment.aiApiUrl || url.startsWith(`${environment.aiApiUrl}/`);
}
