import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './compartilhado/footer/footer.component';
import { IconComponent } from './compartilhado/icon/icon.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterLink, RouterOutlet, FooterComponent, IconComponent],
})
export class AppComponent {
  protected readonly authService = inject(AuthService);

  title = 'Crud UF - Angular/Java';

  logout(): void {
    this.authService.logout();
  }
}
