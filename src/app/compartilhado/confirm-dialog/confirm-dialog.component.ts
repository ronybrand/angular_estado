import { Component, ElementRef, input, output, viewChild } from '@angular/core';

// <dialog> nativo em vez de window.confirm() - acessivel por padrao
// (foco preso dentro do modal, Escape fecha via evento (cancel) nativo,
// role implicito) sem precisar de biblioteca de modal so pra isso.
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  mensagem = input.required<string>();

  confirmar = output<void>();
  cancelar = output<void>();

  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  abrir(): void {
    this.dialog().nativeElement.showModal();
  }

  onConfirmar(): void {
    this.dialog().nativeElement.close();
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.dialog().nativeElement.close();
    this.cancelar.emit();
  }
}
