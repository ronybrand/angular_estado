import { Component, OnInit, viewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';

@Component({
  selector: 'app-lista-estado',
  templateUrl: './lista-estado.component.html',
  styleUrls: ['./lista-estado.component.scss'],
  imports: [ErrorMsgComponent, RouterLink, DatePipe],
})
export class ListaEstadoComponent implements OnInit {
  private estadoService = inject(EstadoService);

  public estados: Estado[] = [];
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getListaEstados();
  }

  getListaEstados() {
    this.estadoService.getListaEstados().subscribe({
      next: (estados: Estado[]) => {
        this.estados = estados;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao buscar estados.'));
      },
    });
  }

  deletaEstado(id: number) {
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
