import { Component, OnInit, ViewChild } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';
import { HttpErrorResponse } from '@angular/common/http';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';

@Component({
  selector: 'app-lista-estado',
  standalone: false,
  templateUrl: './lista-estado.component.html',
  styleUrls: ['./lista-estado.component.scss'],
})
export class ListaEstadoComponent implements OnInit {
  public estados: Estado[] = [];
  @ViewChild(ErrorMsgComponent, { static: true }) errorMsgComponent!: ErrorMsgComponent;

  constructor(private estadoService: EstadoService) {}

  ngOnInit() {
    this.getListaEstados();
  }

  getListaEstados() {
    this.estadoService.getListaEstados().subscribe({
      next: (estados: Estado[]) => {
        this.estados = estados;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent.setError(extraiMensagemErro(error, 'Falha ao buscar estados.'));
      },
    });
  }

  deletaEstado(id: number) {
    this.estadoService.deletaEstado(id).subscribe({
      next: () => {
        this.getListaEstados();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent.setError(extraiMensagemErro(error, 'Falha ao deletar estado.'));
      },
    });
  }

  existemEstados(): boolean {
    return this.estados.length > 0;
  }
}
