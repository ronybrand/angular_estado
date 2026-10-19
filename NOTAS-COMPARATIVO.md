# Notas comparativas — angular_estado vs react_estado

Avaliação 0–10 por área, baseada em inspeção do código-fonte e execução real dos testes (unitários + e2e com axe-core) em 2026-09-14.

| Área                          | angular_estado | react_estado |
| ----------------------------- | -------------- | ------------ |
| Arquitetura/Organização       | 8.5            | 8.5          |
| Testes Unitários              | 8.5            | 8.0          |
| Testes E2E                    | 8.5            | 8.5          |
| Acessibilidade                | 9.5            | 9.5          |
| Qualidade de código/Lint      | 9.0            | 9.0          |
| Tratamento de erros/Validação | 9.0            | 9.0          |
| Documentação                  | 9.5            | 9.5          |
| **Média**                     | **8.9**        | **8.9**      |

## Justificativas

### Arquitetura/Organização — 8.5 / 8.5

Separação clara `paginas|pages` / `compartilhado|shared` / `services` / `interceptors|lib` nos dois. Angular usa standalone components + signals; React usa TanStack Query para data-fetching e hooks customizados por operação (`useCreateState`, `useStateById`, etc). Maturidade equivalente.

### Testes Unitários — 8.5 / 8.0

Angular tem uma proporção spec/arquivo-fonte maior. React cobre hooks indiretamente via componentes (comportamento, não implementação) — estratégia válida, a diferença de proporção não é perseguida deliberadamente (ver decisão abaixo).

### Testes E2E — 8.5 / 8.5

Playwright nos dois, specs equivalentes (criar/editar/listar/excluir, busca/ordenação, login). Suites espelhadas 1:1.

### Acessibilidade — 9.5 / 9.5

Auditoria real com axe-core via Playwright (WCAG 2.1 A/AA), cobrindo login, lista, modal de confirmação, formulários — `expect(violations).toEqual([])` nos dois. `aria-sort` nas colunas ordenáveis e modal `<dialog>` nativo acessível (o React substituiu `window.confirm()` por um `ConfirmDialog` espelhando o `ConfirmDialogComponent` do Angular) — ambos os achados corrigidos e testados.

### Qualidade de código/Lint — 9.0 / 9.0

ESLint + Prettier + Husky/lint-staged rodando no pre-commit nos dois, cobrindo os mesmos tipos de arquivo.

### Tratamento de erros/Validação — 9.0 / 9.0

Sigla/abbreviation valida formato (`^[A-Z]{2}$`) e duplicidade contra as siglas já cadastradas nos dois, com uppercase automático ao digitar. Angular usa Reactive Forms tipado (`FormBuilder.nonNullable`); React usa `react-hook-form` + `zod` com schema dinâmico. Escopo restrito à sigla nos dois — nome não tem restrição de unicidade no domínio.

### Documentação — 9.5 / 9.5

READMEs extensos (EN + pt-BR no Angular), badges de CI/CodeQL/Codecov, diagrama de arquitetura (mermaid), link para o `CASE_STUDY.md` do backend, e a decisão de não paginar a lista na UI (dataset fechado em 27 UFs) documentada explicitamente nos dois.

## Histórico de gaps fechados (2026-09-14)

- Angular: `form-estado` migrado de template-driven forms para Reactive Forms tipado.
- Validação de sigla (formato + duplicidade) implementada nos dois.
- Link para `CASE_STUDY.md` do backend adicionado nos dois.
- Decisão de não paginar a lista documentada nos dois.
- `aria-sort` nas colunas ordenáveis adicionado nos dois.
- React: `window.confirm()` substituído por modal acessível (`ConfirmDialog`), fechando a maior assimetria de acessibilidade real entre os dois projetos.

## Histórico de gaps fechados (2026-09-16)

- Angular: `AuthService.logout()` existia mas não era chamado por nenhum ponto da UI — não havia como sair da aplicação sem esperar o token expirar ou limpar o storage manualmente. React já tinha o botão de logout no `Layout`. Fechado com um botão simples (ícone, sem dropdown/avatar) na navbar, visível só quando autenticado (PR #92).

## Histórico de gaps fechados (2026-09-18)

- Angular e React: página de login não indicava as credenciais de demo (intencionalmente públicas, ver README/ADR 0017 do backend) — quem abrisse a live application não tinha como saber o que digitar sem ir ler o repositório. Fechado nos dois com uma nota (`admin` / `Estado-Demo-2026`) na tela de login (angular_estado PR #93, react_estado PR #51). No Angular, a primeira versão usou `<code>` do Bootstrap e o e2e de acessibilidade (axe-core) acusou contraste insuficiente (4.24:1 contra o fundo cinza do `card-footer`, mínimo AA é 4.5:1) — corrigido trocando por `<strong>`.

## Evolução desde a última avaliação (2026-09-20 a 2026-09-30)

Baseado no histórico de commits; as notas acima **não foram reavaliadas** (testes não reexecutados nesta atualização).

- Angular: nova página `perguntar-ia` (assistente de IA sobre estados, via `estado-ai-agent`), com teste do fluxo e renderização de Markdown na resposta (#99, #100). A chamada passou a ir pelo BFF do backend (`/ask`), removendo `ASK_API_KEY` do bundle; exposição e rotação da chave registradas em ADR (#101, #102).
- Angular: toggle PT/EN na página, idioma compartilhado com o header, fallback para o idioma do navegador, aviso de que o assistente só entende PT/EN, link do repositório no rodapé, explicação de como a consulta funciona e título da aba refletindo o conteúdo (#103–#106, #109, #110).
- React: migrado para Next.js, com proxy `/api` endurecido (allowlist de paths, respostas só JSON, timeout 504, limite de 16 KB no body com 413), CSP com nonce por requisição + `strict-dynamic`, `Permissions-Policy`/`Cross-Origin-Opener-Policy`, e repasse do IP real do cliente ao backend (#70–#76). O Angular não tem camada servidor própria (SPA estática em S3/CloudFront); os headers de segurança, incluindo a CSP, ficam na response headers policy do CloudFront, definida no Terraform do repo `estado`, que agora também envia `Permissions-Policy` e `Cross-Origin-Opener-Policy` (estado PR aberto).
- Angular: `ErrorHandler` global (`GlobalErrorHandler`) que loga erros não tratados e mostra um alerta dispensável, ignorando erros HTTP (já tratados por tela e interceptor), equivalente ao error boundary do React (angular_estado PR #113).
- Divergência nova: as suites e a arquitetura deixaram de ser espelhadas 1:1. A próxima reavaliação deve rodar testes e e2e nos dois e revisar Arquitetura e Testes com essa diferença em mente.

Não havia gap saliente identificado até 2026-09-18. Diferenças futuras tendem a vir de features que um dos dois ganhe antes do outro (como aconteceu com busca/ordenação), não de dívida técnica pendente.
