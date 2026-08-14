import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss'],
})
export class ErrorMsgComponent {
  public error = signal<string | null>(null);

  setError(error: string, tempo = 5000) {
    this.error.set(error);
    setTimeout(() => {
      this.error.set(null);
    }, tempo);
  }
}
