import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { provideMarkdown } from 'ngx-markdown';

import { PerguntarIaComponent } from './perguntar-ia.component';
import { AiAgentService } from '../../services/ai-agent.service';

describe('PerguntarIaComponent', () => {
  let component: PerguntarIaComponent;
  let fixture: ComponentFixture<PerguntarIaComponent>;
  let aiAgentService: { perguntar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    aiAgentService = { perguntar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PerguntarIaComponent],
      providers: [{ provide: AiAgentService, useValue: aiAgentService }, provideMarkdown()],
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
});
