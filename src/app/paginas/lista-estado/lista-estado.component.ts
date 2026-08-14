import { Component, OnInit, viewChild, inject } from '@angular/core';
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

  public estados: Estado[] = [];
  public carregando = true;
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getListaEstados();
  }

  getListaEstados() {
    this.carregando = true;
    this.estadoService.getListaEstados().subscribe({
      next: (estados: Estado[]) => {
        this.estados = estados;
        this.carregando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao buscar estados.'));
        this.carregando = false;
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
    return this.estados.length > 0;
  }
}
