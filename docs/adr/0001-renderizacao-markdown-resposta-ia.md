# 1. Renderização segura de Markdown na resposta do assistente de IA

## Status

Aceita

## Contexto

A resposta de `/ask` (`estado-ai-agent`) vem em Markdown (negrito, listas, e
potencialmente links, código, etc.), mas o template original só fazia
interpolação de texto puro (`{{ answer() }}`) — o usuário via a sintaxe crua
(`**texto**`, `* item`) na tela em vez do texto formatado.

O texto da resposta é gerado por um LLM e, portanto, é **conteúdo não
confiável**: nada impede que a resposta contenha HTML malicioso embutido
(via injeção de prompt, alucinação, ou uma fonte externa que o agente tenha
consultado). Qualquer solução de renderização precisa levar isso em conta
como requisito central, não como detalhe de implementação.

## Decisão

### Usar `ngx-markdown` + `marked` em vez de um parser próprio

Optamos por adotar a lib `ngx-markdown` (que usa `marked` internamente) em
vez de escrever um conversor Markdown→HTML simples na mão (regex para
`**bold**`, `* item`, etc.).

Razão: `ngx-markdown` renderiza via `[innerHTML]`, o que passa pelo
`DomSanitizer` do Angular — o HTML gerado é sanitizado por padrão (remove
`<script>`, atributos `on*`, etc.) sem configuração extra. Reimplementar
esse parsing na mão é exatamente o tipo de código onde XSS costuma vazar por
casos de borda não previstos (esse projeto tem foco em backend/full stack, e
não em construir e manter um parser de Markdown robusto). `marked` é uma lib
madura e amplamente usada nesse papel.

O custo de bundle é pequeno: build de produção foi de ~610kB para ~634kB
(budget de erro do `angular.json` é 1MB).

**Regra derivada:** nunca passar `sanitize: SecurityContext.NONE` para
`provideMarkdown()`/`MarkdownComponent`. Isso reabriria a porta para HTML
injetado pela resposta do LLM. Essa regra é reforçada por uma regra de
ESLint (`no-restricted-syntax` bloqueando `SecurityContext.NONE`) e por um
teste (`perguntar-ia.component.spec.ts`, "should sanitize embedded
HTML/script from the LLM answer") que prova que `<script>`/`onerror`
embutidos na resposta não sobrevivem à renderização.

### Links da resposta abrem em nova aba com `rel="noopener noreferrer"`

O `marked`, por padrão, gera `<a href="...">` sem `target` nem `rel`. Isso
significa (a) o link abre na mesma aba, e (b) sem `rel="noopener"`, a página
de destino ganha acesso a `window.opener` (tabnabbing).

Como a URL do link vem de uma fonte não confiável, tratamos o clique como
saída do app: o link abre em nova aba (`target="_blank"`) e com
`rel="noopener noreferrer"`, para que o destino não possa manipular a aba
de origem nem inferir o referrer.

Implementação: um `Renderer` do `marked` com o método `link` sobrescrito
(`externalLinkRenderer`, em
`src/app/compartilhado/markdown/external-link-renderer.ts`) para emitir
esses atributos, registrado via `MARKED_OPTIONS` em `provideMarkdown()`
(`src/main.ts`).

**Detalhe de implementação não óbvio:** `ngx-markdown` clona o renderer
internamente com `{...renderer}` (para remover flags que ele usa para
controlar extensões) antes de repassar para `marked.use()`. Isso descartou
duas tentativas mais óbvias:

- Um método de subclasse (`class X extends Renderer { override link() {} }`)
  fica no protótipo, não é propriedade própria da instância, e é perdido
  nesse spread — o app silenciosamente volta ao `<a>` default (sem
  `target`/`rel`), sem erro nenhum.
- Um campo de classe com arrow function (`override link = (...) => {}`) é
  propriedade própria e sobrevive ao spread, mas quebra em runtime: a arrow
  function fixa o `this` léxico na instância original, enquanto o `marked`
  injeta `this.parser` no objeto _clonado_ (que é outro objeto) antes de
  chamar `link()`. O resultado é `this.parser` undefined dentro do método.

A solução foi atribuir `renderer.link = function link(...) {...}` **depois**
de instanciar `new Renderer()` — vira propriedade própria (sobrevive ao
clone) e usa `function` (não arrow), então o `this` é resolvido
dinamicamente pelo `marked` no momento da chamada, apontando para o objeto
clonado que de fato tem `.parser`.

Testado em `perguntar-ia.component.spec.ts` ("should open links from the
answer in a new tab without leaking window.opener").

### Não desabilitamos o parsing de link

Alternativa considerada e descartada por ora: desabilitar completamente o
suporte a links no `marked`, deixando qualquer URL como texto puro. Isso
seria mais conservador, mas tira valor real do produto — o agente responde
perguntas factuais sobre estados brasileiros, um domínio onde citar uma
fonte (IBGE, Wikipédia, etc.) com link clicável é desejável. `rel="noopener
noreferrer"` já neutraliza o principal risco técnico (tabnabbing).

Isso deve ser reavaliado se o agente ganhar acesso a fontes verdadeiramente
não confiáveis (browsing, RAG sobre documentos externos, input de terceiros)
— nesse cenário a superfície de prompt injection aumenta e valeria também
validar/normalizar o `href` (permitir só `http`/`https`, bloquear
`javascript:`/`data:`) antes de renderizar o link.

## Consequências

- Toda resposta do `/ask` é renderizada como Markdown sanitizado, não texto
  puro.
- Links na resposta abrem em nova aba, com proteção contra tabnabbing.
- Qualquer mudança futura na configuração do `provideMarkdown()` (ex.: nova
  opção de sanitização, troca de renderer) deve ser revisada à luz desta
  ADR — o requisito central é "conteúdo do LLM é não confiável", não
  "Markdown bonito".
- Se o agente passar a puxar conteúdo de fontes externas não confiáveis, a
  decisão de manter links clicáveis sem validação de `href` deve ser
  revisitada.
