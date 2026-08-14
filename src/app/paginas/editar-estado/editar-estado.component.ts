import { Component, OnInit, viewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { SpinnerComponent } from '../../compartilhado/spinner/spinner.component';
import { EstadoService } from '../../services/estado.service';
import { extraiMensagemErro } from '../../compartilhado/erro/extrai-mensagem-erro';
import { subscreveComCarregamento } from '../../compartilhado/erro/subscreve-com-carregamento';
import { FormEstadoComponent } from '../../compartilhado/form-estado/form-estado.component';

@Component({
  selector: 'app-editar-estado',
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.scss'],
  imports: [ErrorMsgComponent, SpinnerComponent, FormEstadoComponent],
})
export class EditarEstadoComponent implements OnInit {
  private estadoService = inject(EstadoService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  estado = signal<Estado | undefined>(undefined);
  carregando = signal(true);
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getEstado(this.activatedRoute.snapshot.params['id']);
  }

  getEstado(id: number) {
    subscreveComCarregamento(
      this.estadoService.getEstado(id),
      this.carregando,
      this.errorMsgComponent(),
      'Falha ao buscar estado.',
      (estado) => this.estado.set(estado),
    );
  }

  atualizaEstado(estado: Estado) {
    this.estadoService.atualizaEstado(estado).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao atualizar estado.'));
      },
    });
  }
}
