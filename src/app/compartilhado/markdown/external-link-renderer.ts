import { Renderer, type Tokens } from 'marked';

/**
 * A resposta do /ask (ai-agent) e conteudo de LLM, entao qualquer link nela
 * e tratado como originado de fonte nao confiavel: abre em nova aba com
 * rel="noopener noreferrer" para evitar tabnabbing, em vez do <a> default
 * do marked (mesma aba, sem rel).
 *
 * `renderer.link` e atribuido apos a construcao (propriedade propria da
 * instancia), nao definido como metodo de uma subclasse: ngx-markdown clona
 * o renderer internamente com `{...renderer}` para remover flags que ele
 * usa para controlar extensoes, o que so preserva propriedades proprias -
 * um metodo de subclasse ficaria no prototipo e seria perdido nesse clone.
 * `function` (nao arrow) preserva o `this` dinamico que o marked usa para
 * injetar `this.parser` na instancia clonada em tempo de chamada.
 */
const renderer = new Renderer();
renderer.link = function link({ href, title, tokens }: Tokens.Link): string {
  const text = this.parser.parseInline(tokens);
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

export const externalLinkRenderer = renderer;
