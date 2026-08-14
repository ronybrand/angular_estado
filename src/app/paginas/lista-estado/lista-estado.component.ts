import { Component, OnInit, viewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from '../../compartilhado/spinner/spinner.component';
import { EstadoService } from '../../services/estado.service';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';

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
  public excluindo = signal(false);
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getListaEstados();
  }

  getListaEstados() {
    subscreveComProcessando(
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
    subscreveComProcessando(
      this.estadoService.deletaEstado(id),
      this.excluindo,
      this.errorMsgComponent(),
      'Falha ao deletar estado.',
      () => this.getListaEstados(),
    );
  }

  existemEstados(): boolean {
    return this.estados().length > 0;
  }
}
