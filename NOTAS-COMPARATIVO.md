# Notas comparativas — angular_estado vs react_estado

Avaliação 0–10 por área, baseada em inspeção do código-fonte em 2026-09-14 (não inclui execução de aplicação em browser).

| Área                          | angular_estado | react_estado |
| ----------------------------- | -------------- | ------------ |
| Arquitetura/Organização       | 8.5            | 8.5          |
| Testes Unitários              | 8.5            | 8.0          |
| Testes E2E                    | 8.0            | 8.0          |
| Acessibilidade                | 7.5            | 7.5          |
| Qualidade de código/Lint      | 9.0            | 9.0          |
| Tratamento de erros/Validação | 8.5            | 8.5          |
| Documentação                  | 9.0            | 9.0          |
| **Média**                     | **8.4**        | **8.4**      |

## Justificativas

### Arquitetura/Organização — 8.5 / 8.5

Ambos com separação clara `paginas|pages` / `compartilhado|shared` / `services` / `interceptors|lib`. Angular usa standalone components + signals; React usa TanStack Query para data-fetching e hooks customizados por operação (`useCreateState`, `useStateById`, etc). Estruturas equivalentes em maturidade (98 vs 97 commits).

### Testes Unitários — 8.5 / 8.0

Angular: 24 specs para 33 arquivos fonte (~73%, cobertura quase 1:1 em componentes/serviços/interceptors/guards).
React: 22 specs para 42 arquivos fonte (~52%), mas cobre hooks indiretamente via componentes — proporção menor porque a base de código é maior (mais hooks/lib granulares).

### Testes E2E — 8.0 / 8.0

Ambos com Playwright configurado e specs equivalentes: criar/editar/listar estado, login, acessibilidade dedicada. Nenhuma diferença relevante observada na varredura.

### Acessibilidade — 7.5 / 7.5

Angular: 7 arquivos HTML com `aria-*`. React: 8 arquivos TSX com `aria-*`. Ambos têm spec e2e dedicado a acessibilidade — nota limitada por não ter sido feita auditoria com axe-core/lighthouse, só inspeção de atributos.

### Qualidade de código/Lint — 9.0 / 9.0

Ambos com ESLint + Prettier + Husky/lint-staged rodando no pre-commit, cobrindo os mesmos tipos de arquivo.

### Tratamento de erros/Validação — 8.5 / 8.5

Angular migrado (2026-09-14) de `FormsModule`/`ngModel` para Reactive Forms tipado (`FormBuilder.nonNullable.group`, `Validators.required/minLength/maxLength`) em `form-estado.component.ts`, com sincronização via `effect()` e testes cobrindo submit inválido e preservação de campos (`id`, datas) no emit. Módulo de erro HTTP (`compartilhado/erro`) é sólido e testado.
React usa `react-hook-form` + `zod` para validação de schema tipada e explícita em `StateForm`, além de `ErrorMessage`/`useErrorMessage` e `RouteError` para erros de rota.

### Documentação — 9.0 / 9.0

Ambos com README extenso (~190-200 linhas), badges de CI/CodeQL/Codecov, diagrama de arquitetura (mermaid) e versão pt-BR. React explicita a decisão do proxy `/api/*` via `vercel.json`; Angular documenta a stack CloudFront/S3/Caddy/EC2.

## Gap fechado (2026-09-14)

`form-estado` migrado de template-driven forms para Reactive Forms tipado, equiparando a área de Validação com o react_estado.
