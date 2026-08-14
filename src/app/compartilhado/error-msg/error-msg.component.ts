import { Component } from '@angular/core';

@Component({
  selector: 'app-error-msg',
  standalone: false,
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss'],
})
export class ErrorMsgComponent {
  public error: string | null = null;

  setError(error: string, tempo = 5000) {
    this.error = error;
    setTimeout(() => {
      this.error = null;
    }, tempo);
  }
}
