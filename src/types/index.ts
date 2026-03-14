export interface Employee {
  id: string | number;
  name: string;
  city: string;
  salary: number;
  department?: string;
  email?: string;
  [key: string]: unknown;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  login(username: string, password: string): boolean;
  logout(): void;
}

export interface AuditContextValue {
  employees: Employee[];
  setEmployees(employees: Employee[]): void;
  auditImage: string | null;
  setAuditImage(dataUrl: string): void;
}

export interface VirtualizerOptions {
  totalCount: number;
  rowHeight: number;
  containerHeight: number;
  buffer?: number;
}

export interface VirtualizerResult {
  visibleRange: { start: number; end: number };
  totalHeight: number;
  offsetY: number;
}

export interface PersistedAuth {
  isAuthenticated: boolean;
}
