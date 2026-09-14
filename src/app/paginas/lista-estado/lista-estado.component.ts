import { Component, OnInit, OnDestroy, viewChild, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from '../../compartilhado/spinner/spinner.component';
import { IconComponent } from '../../compartilhado/icon/icon.component';
import { ConfirmDialogComponent } from '../../compartilhado/confirm-dialog/confirm-dialog.component';
import { EstadoService } from '../../services/estado.service';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';

type CampoOrdenavel = 'nome' | 'sigla';
type Direcao = 'asc' | 'desc';

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
export class ListaEstadoComponent implements OnInit, OnDestroy {
  private readonly estadoService = inject(EstadoService);

  public estados = signal<Estado[]>([]);
  public carregando = signal(true);
  public excluindo = signal(false);
  public existemEstados = computed(() => this.estados().length > 0);
  public busca = signal('');
  public sortCampo = signal<CampoOrdenavel | null>(null);
  public sortDirecao = signal<Direcao>('asc');
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  readonly confirmDialog = viewChild.required(ConfirmDialogComponent);

  private idParaExcluir: number | null = null;
  // Debounce manual com setTimeout em vez de rxjs (toObservable/debounceTime):
  // e uma unica interacao simples (um input de texto), no resto do projeto
  // nao ha outro caso de debounce que justifique importar o operador so pra
  // isso.
  private debounceBusca: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 300;

  ngOnInit() {
    this.getListaEstados();
  }

  ngOnDestroy() {
    if (this.debounceBusca) {
      clearTimeout(this.debounceBusca);
    }
  }

  getListaEstados() {
    const campo = this.sortCampo();
    const sort = campo ? `${campo},${this.sortDirecao()}` : undefined;
    subscreveComProcessando(
      this.estadoService.getListaEstados(this.busca() || undefined, sort),
      this.carregando,
      this.errorMsgComponent(),
      'Falha ao buscar estados.',
      (estados) => this.estados.set(estados),
    );
  }

  onBuscaChange(valor: string) {
    this.busca.set(valor);
    if (this.debounceBusca) {
      clearTimeout(this.debounceBusca);
    }
    this.debounceBusca = setTimeout(() => this.getListaEstados(), this.DEBOUNCE_MS);
  }

  ordenarPor(campo: CampoOrdenavel) {
    if (this.sortCampo() === campo) {
      this.sortDirecao.set(this.sortDirecao() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortCampo.set(campo);
      this.sortDirecao.set('asc');
    }
    this.getListaEstados();
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
