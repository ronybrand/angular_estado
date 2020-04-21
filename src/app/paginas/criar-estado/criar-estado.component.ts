import { Component, ViewChild } from '@angular/core';
import { EstadoService } from 'src/app/services/estado.service';
import { Router } from '@angular/router';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';

@Component({
  selector: 'app-criar-estado',
  templateUrl: './criar-estado.component.html',
  styleUrls: ['./criar-estado.component.scss']
})
export class CriarEstadoComponent {
  @ViewChild(ErrorMsgComponent, {static: true}) errorMsgComponent: ErrorMsgComponent;

  constructor(private estadoService: EstadoService, private router: Router) { }
 
  addEstado(estado: Estado) {
    this.estadoService.addEstado(estado)
      .subscribe(
        () => { this.router.navigateByUrl('/'); },
        () => { this.errorMsgComponent.setError('Falha ao adicionar estado.'); });
  }
}
