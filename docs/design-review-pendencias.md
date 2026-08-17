# Pendências do code review de design (frontend-design)

Revisão feita em 2026-08-17 na branch `fix/bugs-e-modernizacao`. Itens de copy/acessibilidade/scaffold já foram corrigidos nesta branch. Este documento registra o que ficou pendente e por quê.

## Pendente: identidade visual própria (item 1)

**Achado:** o app não tem nenhuma identidade visual — `styles.scss` e todos os `.scss` de componentes estão vazios, e o layout é o Bootstrap padrão sem paleta, tipografia ou conceito de layout próprios.

**Por que não foi feito agora:**

- Depende da migração para Bootstrap 5 (branch `chore/migrar-bootstrap-5`), já que variáveis Sass e classes utilitárias mudam entre as versões — fazer o design em cima do Bootstrap 4 significaria retrabalho.
- É uma decisão de produto/visual, não um bug ou dívida técnica — não se encaixa no escopo de `fix/bugs-e-modernizacao`.

**Próximo passo sugerido:** depois que `chore/migrar-bootstrap-5` for mergeada, abrir uma branch dedicada (ex.: `feature/design-visual`) e aplicar um design system real: paleta (4–6 cores nomeadas), par de tipografias (display + texto), conceito de layout e um elemento de assinatura — em vez de continuar no Bootstrap sem customização.

## Concluído nesta branch

- Botão de excluir na tabela de estados: rótulo visível trocado de `X` para `Excluir` ([lista-estado.component.html](../src/app/paginas/lista-estado/lista-estado.component.html)).
- Estado vazio da lista agora convida à ação, com botão "Criar o primeiro estado".
- Correção gramatical na mensagem de erro do campo sigla: "Digite a sigla do estado."
- Removido `<br /><br />` e comentário órfão em `app.component.html`, substituídos por espaçamento via classe utilitária (`mt-4`).
