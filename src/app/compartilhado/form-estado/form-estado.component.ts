import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';

@Component({
  selector: 'app-form-estado',
  standalone: false,
  templateUrl: './form-estado.component.html',
  styleUrls: ['./form-estado.component.scss'],
})
export class FormEstadoComponent {
  @Input() estado: Estado = {} as Estado;
  @Output() outputEstado = new EventEmitter<Estado>();

  onSubmit() {
    this.outputEstado.emit(this.estado);
  }
}
