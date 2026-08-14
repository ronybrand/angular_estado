import { Component, OnInit, ViewChild } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { extraiMensagemErro } from 'src/app/compartilhado/erro/extrai-mensagem-erro';

@Component({
  selector: 'app-editar-estado',
  standalone: false,
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.scss'],
})
export class EditarEstadoComponent implements OnInit {
  estado?: Estado;
  @ViewChild(ErrorMsgComponent, { static: true }) errorMsgComponent!: ErrorMsgComponent;

  constructor(
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getEstado(this.activatedRoute.snapshot.params['id']);
  }

  getEstado(id: number) {
    this.estadoService.getEstado(id).subscribe({
      next: (estado) => (this.estado = estado),
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent.setError(extraiMensagemErro(error, 'Falha ao buscar estado.'));
      },
    });
  }

  atualizaEstado(estado: Estado) {
    this.estadoService.atualizaEstado(estado).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMsgComponent.setError(extraiMensagemErro(error, 'Falha ao atualizar estado.'));
      },
    });
  }
}
