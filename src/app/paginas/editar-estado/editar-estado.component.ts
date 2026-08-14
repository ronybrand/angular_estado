import { Component, OnInit, viewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';
import { FormEstadoComponent } from 'src/app/compartilhado/form-estado/form-estado.component';

@Component({
  selector: 'app-editar-estado',
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.scss'],
  imports: [ErrorMsgComponent, FormEstadoComponent],
})
export class EditarEstadoComponent implements OnInit {
  private estadoService = inject(EstadoService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  estado?: Estado;
  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  ngOnInit() {
    this.getEstado(this.activatedRoute.snapshot.params['id']);
  }

  getEstado(id: number) {
    this.estadoService.getEstado(id).subscribe({
      next: (estado) => (this.estado = estado),
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao buscar estado.'));
      },
    });
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
