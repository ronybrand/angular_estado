import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { AiAgentService } from '../../services/ai-agent.service';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';
import { Lang, LangService } from '../../services/lang.service';

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
  }
> = {
  pt: {
    cardTitle: 'Pergunte sobre os estados brasileiros',
    placeholder: 'Ex.: Quantos estados existem na região Sudeste?',
    askButton: 'Perguntar',
    askingButton: 'Perguntando...',
    errorMsg: 'Falha ao consultar o assistente. Tente novamente em instantes.',
    onlyPageNote: 'Por enquanto, esta é a única página do site disponível em inglês.',
  },
  en: {
    cardTitle: 'Ask about the Brazilian states',
    placeholder: 'E.g.: How many states are in the Southeast region?',
    askButton: 'Ask',
    askingButton: 'Asking...',
    errorMsg: 'Failed to reach the assistant. Please try again shortly.',
    onlyPageNote: 'For now, this is the only page on the site available in English.',
  },
};

@Component({
  selector: 'app-perguntar-ia',
  templateUrl: './perguntar-ia.component.html',
  styleUrls: ['./perguntar-ia.component.scss'],
  imports: [FormsModule, ErrorMsgComponent, MarkdownComponent],
})
export class PerguntarIaComponent {
  private aiAgentService = inject(AiAgentService);
  private langService = inject(LangService);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  readonly MAX_QUESTION_LENGTH = 1000; // espelha @Size(max = 1000) de AskRequest no backend

  question = signal('');
  answer = signal<string | null>(null);
  processando = signal(false);
  lang = this.langService.lang;
  translations = computed(() => TRANSLATIONS[this.lang()]);

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
