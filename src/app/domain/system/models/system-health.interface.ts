export interface ServiceStatus {
  status: 'ok' | 'error' | string;
  message?: string;
}

export interface SystemHealth {
  status: 'ok' | 'error' | string;
  services?: {
    database?: ServiceStatus;
    n8n?: ServiceStatus;
    gemini?: ServiceStatus;
    smtp?: ServiceStatus;
  };
  timestamp?: string;
  latency?: number;
}
