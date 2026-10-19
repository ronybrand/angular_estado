import { Component, viewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMsgComponent } from '../../compartilhado/error-msg/error-msg.component';
import { AuthService, LoginRequest } from '../../auth/auth.service';
import { setToken } from '../../auth/token-storage';
import { subscreveComProcessando } from '../../compartilhado/erro/subscreve-com-processando';
import { TranslatePipe } from '../../compartilhado/pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, ErrorMsgComponent, TranslatePipe],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  readonly errorMsgComponent = viewChild.required(ErrorMsgComponent);
  autenticando = signal(false);
  credenciais: LoginRequest = { username: '', password: '' };

  onSubmit() {
    subscreveComProcessando(
      this.authService.login(this.credenciais),
      this.autenticando,
      this.errorMsgComponent(),
      this.translationService.t('invalidCredentialsError'),
      (resposta) => {
        setToken(resposta.token);
        this.router.navigateByUrl('/');
      },
    );
  }
}
