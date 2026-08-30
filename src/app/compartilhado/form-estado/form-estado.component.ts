import { Component, input, output } from '@angular/core';
import { Estado } from '../../interfaces/estado';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-form-estado',
  templateUrl: './form-estado.component.html',
  styleUrls: ['./form-estado.component.scss'],
  imports: [FormsModule, IconComponent],
})
export class FormEstadoComponent {
  readonly estado = input<Estado>({} as Estado);
  readonly desabilitado = input(false);
  readonly outputEstado = output<Estado>();

  onSubmit() {
    this.outputEstado.emit(this.estado());
  }
}
