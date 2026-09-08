import { Component, OnInit, viewChild, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from '../../compartilhado/spinner/spinner.component';
import { IconComponent } from '../../compartilhado/icon/icon.component';
import { ConfirmDialogComponent } from '../../compartilhado/confirm-dialog/confirm-dialog.component';
import { EstadoService } from '../../services/estado.service';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';

@Component({
  selector: 'app-lista-estado',
  templateUrl: './lista-estado.component.html',
  styleUrls: ['./lista-estado.component.scss'],
  imports: [
    ErrorMsgComponent,
    SpinnerComponent,
    IconComponent,
    ConfirmDialogComponent,
    RouterLink,
    DatePipe,
  ],
})
export class ListaEstadoComponent implements OnInit {
  private readonly estadoService = inject(EstadoService);

  public estados = signal<Estado[]>([]);
  public carregando = signal(true);
  public excluindo = signal(false);
  public existemEstados = computed(() => this.estados().length > 0);
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  readonly confirmDialog = viewChild.required(ConfirmDialogComponent);

  private idParaExcluir: number | null = null;

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

  // Abre o modal de confirmacao em vez de excluir na hora - a exclusao de
  // fato so acontece em confirmaExclusao(), chamada quando o usuario
  // confirma no <app-confirm-dialog> (ver ConfirmDialogComponent).
  deletaEstado(id: number) {
    this.idParaExcluir = id;
    this.confirmDialog().abrir();
  }

  confirmaExclusao() {
    const id = this.idParaExcluir;
    if (id === null) {
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

  cancelaExclusao() {
    this.idParaExcluir = null;
  }
}
