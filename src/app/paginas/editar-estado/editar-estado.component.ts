import { Component, OnInit, viewChild, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from '../../compartilhado/spinner/spinner.component';
import { EstadoService } from '../../services/estado.service';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';
import { FormEstadoComponent } from '../../compartilhado/form-estado/form-estado.component';

@Component({
  selector: 'app-editar-estado',
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.scss'],
  imports: [ErrorMsgComponent, SpinnerComponent, FormEstadoComponent],
})
export class EditarEstadoComponent implements OnInit {
  private estadoService = inject(EstadoService);
  private router = inject(Router);

  readonly id = input.required<string>();

  estado = signal<Estado | undefined>(undefined);
  carregando = signal(true);
  salvando = signal(false);
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getEstado(Number(this.id()));
  }

  getEstado(id: number) {
    subscreveComProcessando(
      this.estadoService.getEstado(id),
      this.carregando,
      this.errorMsgComponent(),
      'Falha ao buscar estado.',
      (estado) => this.estado.set(estado),
    );
  }

  atualizaEstado(estado: Estado) {
    subscreveComProcessando(
      this.estadoService.atualizaEstado(estado),
      this.salvando,
      this.errorMsgComponent(),
      'Falha ao atualizar estado.',
      () => this.router.navigateByUrl('/'),
    );
  }
}
