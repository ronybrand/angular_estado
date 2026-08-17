# Pendências do code review de design (frontend-design)

Revisão feita em 2026-08-17 na branch `fix/bugs-e-modernizacao`. Itens de copy/acessibilidade/scaffold já foram corrigidos nesta branch. `chore/migrar-bootstrap-5` foi mergeada em `master` em 2026-08-17 (Bootstrap 5.3.8 via npm, sem resíduos de classes Bootstrap 4). Este documento registra o que ficou pendente e por quê.

## Pendente: identidade visual própria (item 1)

**Achado:** o app não tem nenhuma identidade visual — `styles.scss` e todos os `.scss` de componentes estão vazios, e o layout é o Bootstrap padrão sem paleta, tipografia ou conceito de layout próprios.

**Status:** migração para Bootstrap 5 concluída — o bloqueio técnico foi removido. Próximo passo liberado.

**Próximo passo sugerido:** abrir uma branch dedicada (ex.: `feature/design-visual`) e aplicar um design system real: paleta (4–6 cores nomeadas), par de tipografias (display + texto), conceito de layout e um elemento de assinatura — em vez de continuar no Bootstrap sem customização.

## Concluído nesta branch

- Botão de excluir na tabela de estados: rótulo visível trocado de `X` para `Excluir` ([lista-estado.component.html](../src/app/paginas/lista-estado/lista-estado.component.html)).
- Estado vazio da lista agora convida à ação, com botão "Criar o primeiro estado".
- Correção gramatical na mensagem de erro do campo sigla: "Digite a sigla do estado."
- Removido `<br /><br />` e comentário órfão em `app.component.html`, substituídos por espaçamento via classe utilitária (`mt-4`).
