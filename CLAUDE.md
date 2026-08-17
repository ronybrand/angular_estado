# cliente-estado

Front-end Angular do [Projeto Estado](https://github.com/ronybrand/estado). O projeto tem foco em vagas de **backend/full stack**, então o frontend segue boas práticas e organização, mas sem aprofundar em UI/UX (animações, design system elaborado) — o objetivo é demonstrar o sistema de ponta a ponta com um front funcional, limpo e coerente.

## Convenções

- Componentes standalone, sem `NgModule`.
- Estado local com Signals (`signal`, `computed`), não `BehaviorSubject`/propriedades soltas.
- Injeção via `inject()`, não construtor.
- Angular 22 — usar as APIs mais novas (`input()`/`output()`, `viewChild()`) em vez das decorator-based antigas ao criar componentes novos.
- Estilo: Bootstrap 5 customizado via CSS variables em `src/styles.scss` (paleta `--brand`/`--success`/`--danger`, tipografia Inter + Space Grotesk). Não adicionar Tailwind ou outro framework de CSS. Ver seção "Decisões de design" no README.
- Ícones: SVG inline copiados do Bootstrap Icons (não adicionar a dependência inteira por poucos ícones). Estilização de ícone fica centralizada em `.btn svg` no `styles.scss` — não duplicar por componente.

## Comandos

```bash
npm start          # ng serve com proxy para backend local (localhost:8090)
npm test            # vitest (unit)
npm run e2e          # playwright (e2e)
npm run lint          # eslint
npm run format         # prettier --write
```

Husky + lint-staged rodam eslint/prettier automaticamente no pre-commit — não pular com `--no-verify`.

## Testes

Ao alterar um componente, cubra o comportamento (estado disabled, validação de formulário, aria-attributes) com teste em `*.spec.ts` — não teste CSS/contraste visual: o test runner (`@angular/build:unit-test`) não carrega `src/styles.scss` global, só o build normal carrega.

## Git

Commits pequenos e temáticos (evitar misturar tokens de design + feature de UI + docs num commit só). Mensagens em português, no padrão `tipo(escopo): descrição` (`feat`, `fix`, `style`, `docs`, `chore`).
