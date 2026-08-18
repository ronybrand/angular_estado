# cliente-estado

Front-end Angular do [Projeto Estado](https://github.com/ronybrand/estado) — CRUD de unidades federativas do Brasil (estados). Consome a API Spring Boot do backend em `/api/*`.

Gerado originalmente com [Angular CLI](https://github.com/angular/angular-cli); hoje em Angular 22 (ver `package.json`).

## Development server

To start a local development server, run:

```bash
npm start
```

Isso roda `ng serve --proxy-config proxy.config.js`, proxiando `/api` para o backend local em `http://localhost:8090` (ver `proxy.config.js`). Abra `http://localhost:4200/` — a aplicação recarrega automaticamente a cada mudança nos arquivos-fonte.

## Building

To build the project run:

```bash
npm run build
```

Compila e grava os artefatos em `dist/cliente-estado/browser/`. Por padrão usa a configuração `production` (otimizada, com `outputHashing` nos nomes dos arquivos).

## Lint e formatação

```bash
npm run lint          # eslint (angular-eslint + typescript-eslint)
npm run format:check  # prettier --check
npm run format        # prettier --write
```

Husky + lint-staged rodam `eslint --fix` e `prettier --write` automaticamente no pre-commit.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

## Running end-to-end tests

Testes e2e com [Playwright](https://playwright.dev/) (chromium e firefox):

```bash
npm run e2e
```

## Decisões de design

A identidade visual (`feature/design-visual`) customiza o Bootstrap 5 via CSS
variables (paleta própria, tipografia Inter + Space Grotesk, ícones inline)
em vez de migrar para Tailwind ou outro framework — menos esforço, zero risco
de quebrar a build, e mantém o foco do projeto no backend. Ver
[`src/styles.scss`](src/styles.scss).

## CI/CD

`.github/workflows/ci.yml` roda lint, unit tests, build e e2e em todo push/PR para `master`. Ver a seção [Deploy](#deploy) abaixo para o pipeline de publicação.

## Deploy

O build de produção é publicado em S3 + CloudFront (ver ADR 0013 no repo do
backend `estado`, `docs/adr/0013-frontend-s3-cloudfront.md`). O workflow
`.github/workflows/deploy.yml` builda e sincroniza automaticamente a cada
push em `master` (após a CI passar), autenticando na AWS via OIDC — sem
access key estática.

Variáveis de repositório (Settings → Secrets and variables → Actions →
Variables) necessárias, obtidas nos outputs do Terraform do backend
(`terraform output` em `estado/terraform`):

- `AWS_DEPLOY_ROLE_ARN` — `frontend_deploy_role_arn`
- `AWS_FRONTEND_BUCKET` — `frontend_bucket`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` — `frontend_cloudfront_distribution_id`

A API é acessada em `/api/*` sob o mesmo domínio do CloudFront (que
encaminha pro backend EC2/Caddy) — por isso `environment.prod.ts` usa
`apiUrl: '/api'` relativo, sem CORS cross-origin real.
