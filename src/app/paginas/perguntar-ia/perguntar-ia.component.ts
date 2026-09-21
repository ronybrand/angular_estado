import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiAgentService } from '../../services/ai-agent.service';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';

@Component({
  selector: 'app-perguntar-ia',
  templateUrl: './perguntar-ia.component.html',
  styleUrls: ['./perguntar-ia.component.scss'],
  imports: [FormsModule, ErrorMsgComponent],
})
export class PerguntarIaComponent {
  private aiAgentService = inject(AiAgentService);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  readonly MAX_QUESTION_LENGTH = 1000; // espelha AskController.MAX_QUESTION_LENGTH no backend

  question = signal('');
  answer = signal<string | null>(null);
  processando = signal(false);

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
      'Falha ao consultar o assistente. Tente novamente em instantes.',
      (res) => this.answer.set(res.answer),
    );
  }
}
