import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FooterComponent } from './compartilhado/footer/footer.component';
import { IconComponent } from './compartilhado/icon/icon.component';
import { AuthService } from './auth/auth.service';
import { GlobalErrorHandler } from './services/global-error-handler';
import { Lang, LangService } from './services/lang.service';

const TITLES: Record<Lang, string> = {
  pt: 'Crud UF - Angular/Java',
  en: 'States CRUD - Angular/Java',
};

// Titulo da aba do navegador (distinto do header acima) - detectado uma vez
// a partir do idioma do navegador do visitante, nao do toggle de idioma
// (que so existe na pagina perguntar-ia). As meta tags og:*/twitter:* do
// index.html ficam fixas em ingles porque crawlers de redes sociais nao
// executam JS para ler isso dinamicamente.
const BROWSER_TAB_TITLES: Record<Lang, string> = {
  pt: 'Estado — Demo ao Vivo com Agente de IA',
  en: 'Brazilian States — Live AI Agent Demo',
};

const ASK_IA_LINK_LABELS: Record<Lang, string> = {
  pt: 'Perguntar à IA',
  en: 'Ask AI',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterLink, RouterOutlet, FooterComponent, IconComponent],
})
export class AppComponent {
  protected readonly authService = inject(AuthService);
  protected readonly langService = inject(LangService);
  protected readonly globalError = inject(GlobalErrorHandler);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  constructor() {
    const browserLang: Lang = navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    this.titleService.setTitle(BROWSER_TAB_TITLES[browserLang]);

    // O idioma compartilhado so faz sentido enquanto a pagina perguntar-ia
    // esta ativa (unica com opcao de EN); ao navegar pra fora dela, volta
    // pro default PT pra nao "vazar" EN pro resto do site.
    if (!this.router.url.startsWith('/perguntar-ia')) {
      this.langService.lang.set('pt');
    }
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        if (!event.urlAfterRedirects.startsWith('/perguntar-ia')) {
          this.langService.lang.set('pt');
        }
      });
  }

  get title(): string {
    return TITLES[this.langService.lang()];
  }

  get askIaLinkLabel(): string {
    return ASK_IA_LINK_LABELS[this.langService.lang()];
  }

  logout(): void {
    this.authService.logout();
  }
}
