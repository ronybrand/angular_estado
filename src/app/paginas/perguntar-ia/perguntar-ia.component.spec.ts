import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { provideMarkdown, MARKED_OPTIONS } from 'ngx-markdown';

import { PerguntarIaComponent } from './perguntar-ia.component';
import { AiAgentService } from '../../services/ai-agent.service';
import { externalLinkRenderer } from '../../compartilhado/markdown/external-link-renderer';

describe('PerguntarIaComponent', () => {
  let component: PerguntarIaComponent;
  let fixture: ComponentFixture<PerguntarIaComponent>;
  let aiAgentService: { perguntar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    aiAgentService = { perguntar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PerguntarIaComponent],
      providers: [
        { provide: AiAgentService, useValue: aiAgentService },
        provideMarkdown({
          markedOptions: {
            provide: MARKED_OPTIONS,
            useValue: { renderer: externalLinkRenderer },
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerguntarIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call the service when the question is blank', () => {
    component.question.set('   ');

    component.perguntar();

    expect(aiAgentService.perguntar).not.toHaveBeenCalled();
  });

  it('should trim the question before sending it', () => {
    aiAgentService.perguntar.mockReturnValue(of({ answer: 'resposta' }));
    component.question.set('  Quantos estados existem?  ');

    component.perguntar();

    expect(aiAgentService.perguntar).toHaveBeenCalledWith('Quantos estados existem?');
  });

  it('should set answer with the response from the service', () => {
    aiAgentService.perguntar.mockReturnValue(of({ answer: 'Existem 27 estados.' }));
    component.question.set('Quantos estados existem?');

    component.perguntar();

    expect(component.answer()).toBe('Existem 27 estados.');
  });

  it('should clear the previous answer before a new question is sent', () => {
    const subject = new Subject<{ answer: string }>();
    aiAgentService.perguntar.mockReturnValue(subject);
    component.answer.set('resposta antiga');
    component.question.set('Nova pergunta?');

    component.perguntar();

    expect(component.answer()).toBeNull();
  });

  it('should mark processando while the request is in flight', () => {
    const subject = new Subject<{ answer: string }>();
    aiAgentService.perguntar.mockReturnValue(subject);
    component.question.set('Quantos estados existem?');

    component.perguntar();

    expect(component.processando()).toBe(true);

    subject.next({ answer: 'resposta' });

    expect(component.processando()).toBe(false);
  });

  it('should surface a fallback error message when the ai-agent request fails', () => {
    aiAgentService.perguntar.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    component.question.set('Quantos estados existem?');

    component.perguntar();

    expect(component.errorMsgComponent().error()).toBe(
      'Falha ao consultar o assistente. Tente novamente em instantes.',
    );
  });

  it('should clear processando when the request fails', () => {
    aiAgentService.perguntar.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 429 })),
    );
    component.question.set('Quantos estados existem?');

    component.perguntar();

    expect(component.processando()).toBe(false);
  });

  it('should disable the ask button when the question is blank', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('[data-testid="perguntar-button"]')!;

    expect(button.disabled).toBe(true);
  });

  it('should enable the ask button when the question has content', () => {
    component.question.set('Quantos estados existem?');
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('[data-testid="perguntar-button"]')!;

    expect(button.disabled).toBe(false);
  });

  it('should disable the form and show a spinner while the request is in flight', () => {
    const subject = new Subject<{ answer: string }>();
    aiAgentService.perguntar.mockReturnValue(subject);
    component.question.set('Quantos estados existem?');
    fixture.detectChanges();

    component.perguntar();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('[data-testid="perguntar-button"]')!;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Perguntando...');
    expect(compiled.querySelector('.spinner-border')).toBeTruthy();
  });

  it('should render the answer after a successful question', async () => {
    aiAgentService.perguntar.mockReturnValue(of({ answer: 'Existem 27 estados.' }));
    component.question.set('Quantos estados existem?');

    component.perguntar();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(compiled.querySelector('[data-testid="resposta"]')?.textContent).toContain(
        'Existem 27 estados.',
      );
    });
  });

  it('should render Markdown from the answer instead of showing raw syntax', async () => {
    aiAgentService.perguntar.mockReturnValue(
      of({ answer: '**Santa Catarina** (SC) e **Rio Grande do Sul** (RS).' }),
    );
    component.question.set('Quais estados tem no sul do pais?');

    component.perguntar();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      const resposta = compiled.querySelector('[data-testid="resposta"]');
      expect(resposta?.querySelectorAll('strong').length).toBe(2);
      expect(resposta?.innerHTML).not.toContain('**');
    });
  });

  it('should open links from the answer in a new tab without leaking window.opener', async () => {
    aiAgentService.perguntar.mockReturnValue(
      of({ answer: 'Fonte: [IBGE](https://www.ibge.gov.br/estados.html).' }),
    );
    component.question.set('Qual a fonte dos dados?');

    component.perguntar();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      const link: HTMLAnchorElement | null = compiled.querySelector('[data-testid="resposta"] a');
      expect(link?.getAttribute('href')).toBe('https://www.ibge.gov.br/estados.html');
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('should render the link title attribute when the Markdown link includes one', async () => {
    aiAgentService.perguntar.mockReturnValue(
      of({
        answer: 'Fonte: [IBGE](https://www.ibge.gov.br/estados.html "Fonte oficial").',
      }),
    );
    component.question.set('Qual a fonte dos dados?');

    component.perguntar();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      const link: HTMLAnchorElement | null = compiled.querySelector('[data-testid="resposta"] a');
      expect(link?.getAttribute('title')).toBe('Fonte oficial');
    });
  });

  it('should sanitize embedded HTML/script from the LLM answer', async () => {
    aiAgentService.perguntar.mockReturnValue(
      of({
        answer: 'Texto normal <script>alert(1)</script> <img src="x" onerror="alert(1)">',
      }),
    );
    component.question.set('pergunta qualquer');

    component.perguntar();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      const resposta = compiled.querySelector('[data-testid="resposta"]');
      expect(resposta?.innerHTML).not.toContain('<script');
      expect(resposta?.innerHTML).not.toContain('onerror');
      expect(resposta?.textContent).toContain('Texto normal');
    });
  });

  it('should default to Portuguese', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.card-header')?.textContent).toContain(
      'Pergunte sobre os estados brasileiros',
    );
    const textarea: HTMLTextAreaElement = compiled.querySelector(
      '[data-testid="pergunta-textarea"]',
    )!;
    expect(textarea.placeholder).toBe('Ex.: Quantos estados existem na região Sudeste?');
  });

  it('should toggle back to Portuguese when clicked a second time', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const toggle: HTMLButtonElement = compiled.querySelector('[data-testid="lang-toggle"]')!;

    toggle.click();
    fixture.detectChanges();
    toggle.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.card-header')?.textContent).toContain(
      'Pergunte sobre os estados brasileiros',
    );
  });

  it('should show a note that this is the only English-available page, in the current language', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('[data-testid="lang-note"]')?.textContent).toContain(
      'única página do site disponível em inglês',
    );

    const toggle: HTMLButtonElement = compiled.querySelector('[data-testid="lang-toggle"]')!;
    toggle.click();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="lang-note"]')?.textContent).toContain(
      'only page on the site available in English',
    );
  });

  it('should render English text when the language toggle is switched to EN', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const toggle: HTMLButtonElement = compiled.querySelector('[data-testid="lang-toggle"]')!;

    toggle.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.card-header')?.textContent).toContain(
      'Ask about the Brazilian states',
    );
    const textarea: HTMLTextAreaElement = compiled.querySelector(
      '[data-testid="pergunta-textarea"]',
    )!;
    expect(textarea.placeholder).toBe('E.g.: How many states are in the Southeast region?');
    const button: HTMLButtonElement = compiled.querySelector('[data-testid="perguntar-button"]')!;
    expect(button.textContent).toContain('Ask');
  });

  it('should show the English error message when a call fails in EN mode', () => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    const toggle: HTMLButtonElement = compiled.querySelector('[data-testid="lang-toggle"]')!;
    toggle.click();
    fixture.detectChanges();

    aiAgentService.perguntar.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    component.question.set('How many states are there?');

    component.perguntar();

    expect(component.errorMsgComponent().error()).toBe(
      'Failed to reach the assistant. Please try again shortly.',
    );
  });
});
