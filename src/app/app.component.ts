import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './compartilhado/footer/footer.component';
import { IconComponent } from './compartilhado/icon/icon.component';
import { AuthService } from './auth/auth.service';
import { GlobalErrorHandler } from './services/global-error-handler';
import { LangService } from './services/lang.service';
import { TranslationService } from './services/translation.service';

const BROWSER_TAB_TITLES = {
  pt: 'Estado — Demo ao Vivo com Agente de IA',
  en: 'Brazilian States — Live AI Agent Demo',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterLink, RouterOutlet, FooterComponent, IconComponent],
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly langService = inject(LangService);
  protected readonly translationService = inject(TranslationService);
  protected readonly globalError = inject(GlobalErrorHandler);
  private readonly titleService = inject(Title);

  constructor() {
    const browserLang = navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    this.titleService.setTitle(BROWSER_TAB_TITLES[browserLang]);
  }

  get title(): string {
    return this.translationService.t('appTitle');
  }

  get askIaLinkLabel(): string {
    return this.translationService.t('askIaLinkLabel');
  }

  toggleLang(): void {
    this.langService.toggle();
  }

  /**
   * Returns true if the current route supports English translation.
   * Currently only the 'perguntar-ia' page has EN translations.
   */
  get supportsEn(): boolean {
    return this.router.url.includes('perguntar-ia');
  }

  logout(): void {
    this.authService.logout();
  }
}
