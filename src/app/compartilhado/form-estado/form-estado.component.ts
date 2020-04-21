import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';

@Component({
  selector: 'app-form-estado',
  templateUrl: './form-estado.component.html',
  styleUrls: ['./form-estado.component.scss']
})
export class FormEstadoComponent {
  @Input() estado: Estado = <Estado>{};
  @Output() outputEstado: EventEmitter<Estado> = new EventEmitter();

  onSubmit() {
    this.outputEstado.emit(this.estado);
  }

}
