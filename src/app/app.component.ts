import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './compartilhado/footer/footer.component';
import { IconComponent } from './compartilhado/icon/icon.component';
import { AuthService } from './auth/auth.service';
import { Lang, LangService } from './services/lang.service';

const TITLES: Record<Lang, string> = {
  pt: 'Crud UF - Angular/Java',
  en: 'States CRUD - Angular/Java',
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
