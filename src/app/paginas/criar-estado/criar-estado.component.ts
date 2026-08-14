import { Component, ViewChild } from '@angular/core';
import { EstadoService } from 'src/app/services/estado.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';

@Component({
  selector: 'app-criar-estado',
  standalone: false,
  templateUrl: './criar-estado.component.html',
  styleUrls: ['./criar-estado.component.scss'],
})
export class CriarEstadoComponent {
  @ViewChild(ErrorMsgComponent, { static: true }) errorMsgComponent!: ErrorMsgComponent;

  constructor(
    private estadoService: EstadoService,
    private router: Router,
  ) {}

  addEstado(estado: Estado) {
    this.estadoService.addEstado(estado).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent.setError(extraiMensagemErro(error, 'Falha ao adicionar estado.'));
      },
    });
  }
}
