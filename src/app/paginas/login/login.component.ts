import { Component, viewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { AuthService, LoginRequest } from '../../auth/auth.service';
import { setToken } from '../../auth/token-storage';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, ErrorMsgComponent],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  autenticando = signal(false);
  credenciais: LoginRequest = { username: '', password: '' };

  onSubmit() {
    subscreveComProcessando(
      this.authService.login(this.credenciais),
      this.autenticando,
      this.errorMsgComponent(),
      'Usuário ou senha inválidos.',
      (resposta) => {
        setToken(resposta.token);
        this.router.navigateByUrl('/');
      },
    );
  }
}
