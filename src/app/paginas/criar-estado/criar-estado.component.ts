import { Component, viewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Estado } from '../../interfaces/estado';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { EstadoService } from '../../services/estado.service';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';
import { FormEstadoComponent } from '../../compartilhado/form-estado/form-estado.component';
import { TranslatePipe } from '../../compartilhado/pipes/translate.pipe';

@Component({
  selector: 'app-criar-estado',
  templateUrl: './criar-estado.component.html',
  styleUrls: ['./criar-estado.component.scss'],
  imports: [ErrorMsgComponent, FormEstadoComponent, TranslatePipe],
})
export class CriarEstadoComponent {
  private estadoService = inject(EstadoService);
  private router = inject(Router);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  salvando = signal(false);
  siglasExistentes = signal<string[]>([]);

  constructor() {
    this.estadoService.getSiglasExistentes().subscribe({
      next: (siglas) => this.siglasExistentes.set(siglas),
      error: () => {
        // Falha ao pre-carregar siglas so desativa a checagem de duplicidade
        // no cliente; o backend ainda rejeita duplicatas no submit.
      },
    });
  }

  addEstado(estado: Estado) {
    subscreveComProcessando(
      this.estadoService.addEstado(estado),
      this.salvando,
      this.errorMsgComponent(),
      'Falha ao adicionar estado.',
      () => this.router.navigateByUrl('/'),
    );
  }
}
