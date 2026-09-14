import { Component, computed, input, output } from '@angular/core';
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
  readonly estadoOriginal = input<Estado>();
  readonly desabilitado = input(false);
  readonly outputEstado = output<Estado>();

  onSubmit() {
    this.outputEstado.emit(this.estado());
  }

  readonly alterado = computed(() => {
    const original = this.estadoOriginal();
    if (!original) {
      return true;
    }
    return this.estado().sigla !== original.sigla || this.estado().nome !== original.nome;
  });
}
