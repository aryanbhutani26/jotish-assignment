import React, { createContext, useContext, useState } from 'react';
import type { AuditContextValue, Employee } from '../types';

const AuditContext = createContext<AuditContextValue>({
  employees: [],
  setEmployees: () => {},
  auditImage: null,
  setAuditImage: () => {},
});

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [auditImage, setAuditImage] = useState<string | null>(null);

  return (
    <AuditContext.Provider value={{ employees, setEmployees, auditImage, setAuditImage }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit(): AuditContextValue {
  return useContext(AuditContext);
}

export default AuditContext;
