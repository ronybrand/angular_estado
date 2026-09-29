import { Component, DestroyRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { AiAgentService } from '../../services/ai-agent.service';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';
import { Lang, LangService } from '../../services/lang.service';

function isLang(value: string | null): value is Lang {
  return value === 'pt' || value === 'en';
}

// Dicionario local de textos desta pagina; o estado do idioma em si vem do
// LangService compartilhado (o header tambem le dele, ver app.component).
// Nao e um i18n do app inteiro: paginas sem traducao continuam fixas em PT.
const TRANSLATIONS: Record<
  Lang,
  {
    cardTitle: string;
    placeholder: string;
    askButton: string;
    askingButton: string;
    errorMsg: string;
    onlyPageNote: string;
    languageLimitNote: string;
    howItWorksNote: string;
    sourceLinkText: string;
  }
> = {
  pt: {
    cardTitle: 'Pergunte sobre os estados brasileiros',
    placeholder: 'Ex.: Quantos estados existem na região Sudeste?',
    askButton: 'Perguntar',
    askingButton: 'Perguntando...',
    errorMsg: 'Falha ao consultar o assistente. Tente novamente em instantes.',
    onlyPageNote: 'Por enquanto, esta é a única página do site disponível em inglês.',
    languageLimitNote: 'O assistente entende perguntas apenas em português ou inglês.',
    howItWorksNote:
      'Agente com tool calling (Spring AI + Gemini) consultando a API real do backend em tempo real, sem respostas roteirizadas.',
    sourceLinkText: 'Ver código no GitHub',
  },
  en: {
    cardTitle: 'Ask about the Brazilian states',
    placeholder: 'E.g.: How many states are in the Southeast region?',
    askButton: 'Ask',
    askingButton: 'Asking...',
    errorMsg: 'Failed to reach the assistant. Please try again shortly.',
    onlyPageNote: 'For now, this is the only page on the site available in English.',
    languageLimitNote: 'The assistant only understands questions in Portuguese or English.',
    howItWorksNote:
      'Tool-calling agent (Spring AI + Gemini) querying the real backend API live, not a scripted response.',
    sourceLinkText: 'View source on GitHub',
  },
};

const SOURCE_REPO_URL = 'https://github.com/ronybrand/estado-ai-agent';

@Component({
  selector: 'app-perguntar-ia',
  templateUrl: './perguntar-ia.component.html',
  styleUrls: ['./perguntar-ia.component.scss'],
  imports: [FormsModule, ErrorMsgComponent, MarkdownComponent],
})
export class PerguntarIaComponent {
  private aiAgentService = inject(AiAgentService);
  private langService = inject(LangService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private destroyRef = inject(DestroyRef);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  readonly MAX_QUESTION_LENGTH = 1000; // espelha @Size(max = 1000) de AskRequest no backend
  readonly sourceRepoUrl = SOURCE_REPO_URL;

  question = signal('');
  answer = signal<string | null>(null);
  processando = signal(false);
  lang = this.langService.lang;
  translations = computed(() => TRANSLATIONS[this.lang()]);

  constructor() {
    // Prioridade: ?lang= explicito na URL (ex.: link do curriculo em ingles)
    // > idioma do navegador > default PT do LangService.
    const langParam = this.route.snapshot.queryParamMap.get('lang');
    if (isLang(langParam)) {
      this.langService.lang.set(langParam);
    } else if (window.navigator.language.toLowerCase().startsWith('en')) {
      this.langService.lang.set('en');
    }

    // Reaproveita o cardTitle (mesmo texto do heading da pagina) em vez de
    // duplicar uma frase parecida so pro <title> - reage ao toggle de idioma
    // e volta ao titulo padrao do index.html ao sair da pagina.
    const defaultTitle = this.titleService.getTitle();
    effect(() => this.titleService.setTitle(`${this.translations().cardTitle} · Estado`));
    this.destroyRef.onDestroy(() => this.titleService.setTitle(defaultTitle));
  }

  toggleLang() {
    this.langService.toggle();
  }

  perguntar() {
    const pergunta = this.question().trim();
    if (!pergunta) {
      return;
    }

    this.answer.set(null);
    subscreveComProcessando(
      this.aiAgentService.perguntar(pergunta),
      this.processando,
      this.errorMsgComponent(),
      this.translations().errorMsg,
      (res) => this.answer.set(res.answer),
    );
  }
}
