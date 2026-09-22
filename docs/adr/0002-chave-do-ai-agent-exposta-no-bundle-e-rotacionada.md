# 2. Chave do estado-ai-agent exposta no bundle e rotacionada

## Status

Aceita

## Contexto

Antes do backend `estado` existir como BFF para `/ask` (commit `8e37eb2`,
"pagina para perguntar sobre estados via IA"), este frontend chamava o
`estado-ai-agent` diretamente do navegador, com a `ASK_API_KEY` embutida em
`environment.ts`/`environment.prod.ts` (`aiApiKey`) e anexada pelo
`aiApiKeyInterceptor`. O comentário no próprio código já reconhecia o
trade-off:

> Enviada pelo proprio frontend (projeto de portfolio, risco aceito - nao e
> um segredo real; rate limit por IP no backend e a defesa principal).

Qualquer chave enviada por um frontend público, no entanto, é visível a
qualquer um que abra as ferramentas de desenvolvedor do navegador - e, pior,
uma vez commitada, permanece legível no histórico do git para sempre,
mesmo depois de removida do código atual.

## Decisão

O commit `e1f679f` ("chama /ask via BFF do backend estado, remove
ASK_API_KEY do bundle") corrigiu a arquitetura: a partir dele, `/ask` passa
pelo backend `estado` (`AskProxyController`), que guarda a `ASK_API_KEY`
server-side e nunca a expõe ao navegador (ver `ai-agent.service.ts` atual,
que chama só `environment.apiUrl` - o domínio do próprio backend `estado`,
nunca o do `ai-agent` diretamente).

A chave que ficou exposta nos commits anteriores a `e1f679f`
(`aiApiKey: 'ANGe58h0dJhtioodEyeSEDMWKWV+easG23uAgwmwvUc='`) foi
**rotacionada** em produção depois da migração. O valor antigo, ainda
visível no histórico do git deste repositório, está inerte.

Decidimos **não reescrever o histórico do git** para remover o valor
exposto: a chave já foi tratada como comprometida a partir do momento da
exposição pública (prática padrão de segurança), independentemente de
aparecer ou não no histórico depois - reescrever não devolve nenhuma
proteção que a rotação já não tenha dado, e teria custo real (invalida SHAs
de todos os commits posteriores, forks e PRs referenciando eles) para
ganho de segurança zero. O commit `e1f679f` também é, por si só, evidência
de maturidade (identificação e correção do próprio antipadrão) que vale
manter visível no histórico.

## Consequências

- Nenhuma ação adicional é necessária sobre a chave antiga - ela está
  rotacionada e o valor no histórico é apenas um artefato morto.
- Qualquer novo segredo (deste ou de outro serviço) commitado por engano
  no futuro deve seguir a mesma política: rotacionar imediatamente após
  descoberta, documentar aqui ou em ADR equivalente, e só considerar
  reescrever histórico se houver uma razão adicional (ex.: política de
  compliance que exija isso, não presente neste projeto de portfólio).
- Reforça a decisão de manter todo acesso a serviços internos (`estado-ai-agent`,
  banco de dados) exclusivamente server-to-server, nunca a partir do bundle
  do frontend.
