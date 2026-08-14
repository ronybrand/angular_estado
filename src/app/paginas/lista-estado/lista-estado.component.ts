import { Component, OnInit, viewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from 'src/app/compartilhado/spinner/spinner.component';
import { EstadoService } from 'src/app/services/estado.service';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';

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
    this.carregando.set(true);
    this.estadoService.getListaEstados().subscribe({
      next: (estados: Estado[]) => {
        this.estados.set(estados);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao buscar estados.'));
        this.carregando.set(false);
      },
    });
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
