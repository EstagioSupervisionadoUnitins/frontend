import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubmissionEvent, EventType } from '../models/submission-event.model';
import { environment } from '../../../environments/environment';

@Injectable() // providedIn: 'root' NÃO usar — deve ter escopo de componente
              // para que o estado seja limpo ao sair da questão
export class SubmissionTelemetryService implements OnDestroy {
  private events: SubmissionEvent[] = [];
  private questionOpenedAt!: string;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------------------------
  // Inicializa a captura para uma questão específica.
  // Deve ser chamado no ngOnInit do componente de resposta.
  // -------------------------------------------------------------------------
  startTracking(): void {
    this.events = [];
    this.questionOpenedAt = new Date().toISOString();

    this.pushEvent('question_opened', this.questionOpenedAt, {});
    this.listenToTabVisibility();
  }

  // -------------------------------------------------------------------------
  // Registra eventos de colagem (paste) em um textarea/input específico.
  // Deve ser chamado passando a referência nativa do elemento editor.
  // -------------------------------------------------------------------------
  attachPasteListener(element: HTMLElement): void {
    fromEvent<ClipboardEvent>(element, 'paste')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.onPaste(event));
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') ?? '';

    this.pushEvent('paste', new Date().toISOString(), {
      pasted_content: pastedText,  // backend sanitiza; nunca persiste o completo
      field: 'code'
    });
  }

  // -------------------------------------------------------------------------
  // Registra manualmente um evento de paste com o conteúdo obtido.
  // Útil se formos interceptar via Monaco Editor diretamente.
  // -------------------------------------------------------------------------
  registerPaste(content: string): void {
    console.log('[Telemetry] registerPaste acionado. Conteúdo colado:', content);
    this.pushEvent('paste', new Date().toISOString(), {
      pasted_content: content,
      field: 'code'
    });
  }

  // -------------------------------------------------------------------------
  // Envia todos os eventos acumulados em lote para o backend.
  // -------------------------------------------------------------------------
  flushEvents(submissionId: number): void {
    console.log('[Telemetry] flushEvents acionado. Total de eventos no buffer:', this.events.length);
    if (this.events.length === 0) return;

    const payload = { events: [...this.events] };

    this.http
      .post(`${environment.apiUrl}/submissions/${submissionId}/events`, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => console.log('[Telemetry] Eventos enviados com sucesso. Dados enviados:', payload),
        error: (err) =>
          console.warn('[Telemetry] Falha ao enviar eventos (não crítico):', err)
      });
  }

  // -------------------------------------------------------------------------
  // Limpa o estado e remove listeners ao sair do componente.
  // -------------------------------------------------------------------------
  ngOnDestroy(): void {
    console.log('[Telemetry] Destruindo serviço e limpando listeners.');
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------
  private listenToTabVisibility(): void {
    // 1. Escuta visibilitychange no document (mudança de abas no navegador)
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const type: EventType = document.hidden ? 'tab_hidden' : 'tab_visible';
        console.log('[Telemetry] Visibilidade da aba alterada (document):', type);
        this.pushEvent(type, new Date().toISOString(), {});
      });

    // 2. Escuta blur no window (quando o usuário clica fora da janela do navegador, ex: abre o VS Code ou terminal)
    fromEvent(window, 'blur')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const type: EventType = 'tab_hidden';
        console.log('[Telemetry] Foco da janela perdido (window blur):', type);
        this.pushEvent(type, new Date().toISOString(), {});
      });

    // 3. Escuta focus no window (quando o usuário clica de volta no navegador)
    fromEvent(window, 'focus')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const type: EventType = 'tab_visible';
        console.log('[Telemetry] Foco da janela recuperado (window focus):', type);
        this.pushEvent(type, new Date().toISOString(), {});
      });
  }

  private pushEvent(
    type: EventType,
    occurredAt: string,
    payload: Record<string, unknown>
  ): void {
    const event = { event_type: type, occurred_at: occurredAt, payload };
    this.events.push(event);
    console.log('[Telemetry] Novo evento registrado no buffer local:', event);
  }
}
