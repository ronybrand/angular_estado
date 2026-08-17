# Pendências do code review de design (frontend-design)

Revisão feita em 2026-08-17 na branch `fix/bugs-e-modernizacao`. Itens de copy/acessibilidade/scaffold já foram corrigidos nesta branch. `chore/migrar-bootstrap-5` foi mergeada em `master` em 2026-08-17 (Bootstrap 5.3.8 via npm, sem resíduos de classes Bootstrap 4). Este documento registra o que ficou pendente e por quê.

## Concluído: identidade visual própria (item 1)

Implementado em `feature/design-visual`. Decisão: manter Bootstrap 5 e customizá-lo via CSS variables, em vez de migrar para Tailwind — menos esforço, zero risco de quebrar a build, e mais fácil de justificar ("customizei o tema do Bootstrap com design tokens") num contexto de avaliação técnica onde o foco é backend.

- Paleta própria (`--brand`, `--success`, `--danger`) sobrescrevendo as variáveis do Bootstrap 5 (`--bs-primary`, `--bs-btn-bg`, etc.), incluindo o estado `disabled` dos botões.
- Tipografia: Inter (corpo) + Space Grotesk (títulos/headers de card), via Google Fonts.
- Badge redondo para a sigla do estado, datas em fonte monoespaçada, ícones inline (SVG copiados do Bootstrap Icons, sem adicionar a dependência inteira só por 4 ícones).
- `prefers-reduced-motion` e foco visível (`:focus-visible`) tratados globalmente em `src/styles.scss`.

## Concluído nesta branch

- Botão de excluir na tabela de estados: rótulo visível trocado de `X` para `Excluir` ([lista-estado.component.html](../src/app/paginas/lista-estado/lista-estado.component.html)).
- Estado vazio da lista agora convida à ação, com botão "Criar o primeiro estado".
- Correção gramatical na mensagem de erro do campo sigla: "Digite a sigla do estado."
- Removido `<br /><br />` e comentário órfão em `app.component.html`, substituídos por espaçamento via classe utilitária (`mt-4`).
