# ClienteEstadoNew

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.21.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

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

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
