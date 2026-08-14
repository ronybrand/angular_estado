import { Component, input, output } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-estado',
  templateUrl: './form-estado.component.html',
  styleUrls: ['./form-estado.component.scss'],
  imports: [FormsModule],
})
export class FormEstadoComponent {
  readonly estado = input<Estado>({} as Estado);
  readonly outputEstado = output<Estado>();

  onSubmit() {
    this.outputEstado.emit(this.estado());
  }
}
