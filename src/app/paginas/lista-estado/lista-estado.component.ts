import { Component, OnInit, viewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from '../../compartilhado/spinner/spinner.component';
import { EstadoService } from '../../services/estado.service';
import { extraiMensagemErro } from '../../compartilhado/erro/extrai-mensagem-erro';
import { subscreveComCarregamento } from '../../compartilhado/erro/subscreve-com-carregamento';

@Component({
  selector: 'app-lista-estado',
  templateUrl: './lista-estado.component.html',
  styleUrls: ['./lista-estado.component.scss'],
  imports: [ErrorMsgComponent, SpinnerComponent, RouterLink, DatePipe],
})
export class ListaEstadoComponent implements OnInit {
  private estadoService = inject(EstadoService);

  public estados = signal<Estado[]>([]);
  public carregando = signal(true);
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getListaEstados();
  }

  getListaEstados() {
    subscreveComCarregamento(
      this.estadoService.getListaEstados(),
      this.carregando,
      this.errorMsgComponent(),
      'Falha ao buscar estados.',
      (estados) => this.estados.set(estados),
    );
  }

  deletaEstado(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este estado?')) {
      return;
    }
    this.estadoService.deletaEstado(id).subscribe({
      next: () => {
        this.getListaEstados();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao deletar estado.'));
      },
    });
  }

  existemEstados(): boolean {
    return this.estados().length > 0;
  }
}
