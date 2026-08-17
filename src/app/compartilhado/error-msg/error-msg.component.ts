import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss'],
})
export class ErrorMsgComponent {
  public error = signal<string | null>(null);
  public requestId = signal<string | null>(null);
  private limpezaTimeoutId: ReturnType<typeof setTimeout> | undefined;

  setError(error: string, requestId: string | null = null, tempo = 5000) {
    clearTimeout(this.limpezaTimeoutId);

    this.error.set(error);
    this.requestId.set(requestId);
    this.limpezaTimeoutId = setTimeout(() => {
      this.error.set(null);
      this.requestId.set(null);
    }, tempo);
  }
}
