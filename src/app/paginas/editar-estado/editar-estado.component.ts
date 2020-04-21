import { Component, OnInit, ViewChild } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-estado',
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.scss']
})
export class EditarEstadoComponent {
  estado: Estado;
  public siglaEstado: string;
  public nomeEstado: string;
  @ViewChild(ErrorMsgComponent, {static: true}) errorMsgComponent: ErrorMsgComponent;

  constructor(
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.getEstado(this.activatedRoute.snapshot.params.id);
    }

  getEstado(id: number) {
    /*this.estadoService.getEstado(id)
      .subscribe(data => {
        this.siglaEstado = data.sigla;
        this.nomeEstado = data.nome;
      }, error => console.log(error));*/
      /*this.estadoService.getEstado(id)
      .subscribe(data => {
        console.log(data);
        this.estado = data;
      }, () => this.errorMsgComponent.setError('Falha ao buscar estado.'));*/
      this.estadoService.getEstado(id)
      .subscribe(estado => this.estado = estado,
        response => {});
    /*this.estadoService.getEstado(id)
      .subscribe((estado: Estado) => {
        this.estado = estado;
        console.log(this.estado);
      }, () => { this.errorMsgComponent.setError('Falha ao buscar estado.'); });*/
  }

  atualizaEstado(estado: Estado) {
    this.estadoService.atualizaEstado(estado)
      .subscribe(
        () => { this.router.navigateByUrl('/'); },
        () => { this.errorMsgComponent.setError('Falha ao atualizar estado.'); });
  }


}
