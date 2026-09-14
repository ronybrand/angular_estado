import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Estado } from '../../interfaces/estado';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-form-estado',
  templateUrl: './form-estado.component.html',
  styleUrls: ['./form-estado.component.scss'],
  imports: [ReactiveFormsModule, IconComponent],
})
export class FormEstadoComponent {
  readonly estado = input<Estado>({} as Estado);
  readonly estadoOriginal = input<Estado>();
  readonly desabilitado = input(false);
  readonly siglasExistentes = input<string[]>([]);
  readonly outputEstado = output<Estado>();

  private readonly fb = inject(FormBuilder).nonNullable;

  readonly form = this.fb.group({
    sigla: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Z]{2}$/),
        (control: AbstractControl): ValidationErrors | null => this.validaSiglaUnica(control),
      ],
    ],
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
  });

  private ultimoSigla: string | undefined;
  private ultimoNome: string | undefined;

  constructor() {
    effect(() => {
      const estado = this.estado();
      const sigla = estado.sigla ?? '';
      const nome = estado.nome ?? '';
      if (sigla === this.ultimoSigla && nome === this.ultimoNome) {
        return;
      }
      this.ultimoSigla = sigla;
      this.ultimoNome = nome;
      this.form.patchValue({ sigla, nome }, { emitEvent: false });
    });

    effect(() => {
      this.siglasExistentes();
      this.form.controls.sigla.updateValueAndValidity();
    });

    this.form.controls.sigla.valueChanges.pipe(takeUntilDestroyed()).subscribe((valor) => {
      const maiuscula = valor.toUpperCase();
      if (valor !== maiuscula) {
        this.form.controls.sigla.setValue(maiuscula, { emitEvent: false });
      }
    });
  }

  private validaSiglaUnica(control: AbstractControl): ValidationErrors | null {
    const sigla = (control.value as string)?.toUpperCase();
    const siglaOriginal = this.estadoOriginal()?.sigla;
    if (sigla && sigla !== siglaOriginal && this.siglasExistentes().includes(sigla)) {
      return { siglaDuplicada: true };
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.outputEstado.emit({ ...this.estado(), ...this.form.getRawValue() });
  }

  alterado(): boolean {
    const original = this.estadoOriginal();
    if (!original) {
      return true;
    }
    const { sigla, nome } = this.form.getRawValue();
    return sigla !== original.sigla || nome !== original.nome;
  }
}
