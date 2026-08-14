import { Component, viewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';
import { FormEstadoComponent } from 'src/app/compartilhado/form-estado/form-estado.component';

@Component({
  selector: 'app-criar-estado',
  templateUrl: './criar-estado.component.html',
  styleUrls: ['./criar-estado.component.scss'],
  imports: [ErrorMsgComponent, FormEstadoComponent],
})
export class CriarEstadoComponent {
  private estadoService = inject(EstadoService);
  private router = inject(Router);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);

  addEstado(estado: Estado) {
    this.estadoService.addEstado(estado).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent().setError(extraiMensagemErro(error, 'Falha ao adicionar estado.'));
      },
    });
  }
}
