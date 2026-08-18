import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InfoService } from '../../services/info.service';
import { FrontendVersion } from '../../interfaces/frontend-version';
import { BackendInfo } from '../../interfaces/backend-info';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [DatePipe],
})
export class FooterComponent implements OnInit {
  private infoService = inject(InfoService);

  public frontendVersion = signal<FrontendVersion | null>(null);
  public backendInfo = signal<BackendInfo | null>(null);

  ngOnInit() {
    // Rodapé é informativo, não crítico - se front ou back não responderem,
    // a seção correspondente some silenciosamente, sem alertar o usuário.
    this.infoService.getFrontendVersion().subscribe({
      next: (versao) => this.frontendVersion.set(versao),
      error: () => this.frontendVersion.set(null),
    });
    this.infoService.getBackendInfo().subscribe({
      next: (info) => this.backendInfo.set(info),
      error: () => this.backendInfo.set(null),
    });
  }
}
