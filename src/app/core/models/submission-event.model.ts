export type EventType = 'paste' | 'tab_hidden' | 'tab_visible' | 'question_opened';

export interface SubmissionEventPayload {
  pasted_content?: string;  // enviado pelo frontend; sanitizado pelo backend
  field?: string;           // 'code' — identifica qual campo foi colado
  [key: string]: unknown;
}

export interface SubmissionEvent {
  event_type: EventType;
  occurred_at: string;       // ISO 8601, gerado com new Date().toISOString()
  payload: SubmissionEventPayload;
}
