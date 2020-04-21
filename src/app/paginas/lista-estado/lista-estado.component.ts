import { Component, OnInit, ViewChild } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';
import { ErrorMsgComponent } from 'src/app/compartilhado/error-msg/error-msg.component';
import { EstadoService } from 'src/app/services/estado.service';

@Component({
  selector: 'app-lista-estado',
  templateUrl: './lista-estado.component.html',
  styleUrls: ['./lista-estado.component.scss']
})
export class ListaEstadoComponent implements OnInit {

  public estados: Estado[];
  @ViewChild(ErrorMsgComponent, {static: true}) errorMsgComponent: ErrorMsgComponent;


  constructor(private estadoService: EstadoService) { }

  ngOnInit() {
    this.getListaEstados();
  }

  getListaEstados() {
    this.estadoService.getListaEstados()
      .subscribe((estados: Estado[]) => {
        this.estados = estados;
      }, () => { this.errorMsgComponent.setError('Falha ao buscar estados.'); });
  }
 
  deletaEstado(id: number) {
    this.estadoService.deletaEstado(id)
      .subscribe(() => {
        this.getListaEstados();
      }, () => { this.errorMsgComponent.setError('Falha ao deletar estado.'); });
  }
 
  existemEstados(): boolean {
    return this.estados && this.estados.length > 0;
  }
 

}
