import { useEffect, useState } from 'react';
import { fetchEmployees } from '../api/employeeApi';
import { useAudit } from '../contexts/AuditContext';
import VirtualGrid from '../components/VirtualGrid';

function ListPage() {
  const { employees, setEmployees } = useAudit();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchEmployees()
      .then((data) => {
        setEmployees(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load employees.';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setEmployees]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Page header */}
      <header
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#1e40af',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
          Employee Insights Dashboard
        </h1>
        {!loading && !error && employees.length > 0 && (
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', opacity: 0.8 }}>
            {employees.length} employees
          </p>
        )}
      </header>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'hidden', padding: '0' }}>
        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6b7280',
              fontSize: '1rem',
            }}
          >
            Loading employees…
          </div>
        )}

        {error && !loading && (
          <div
            role="alert"
            style={{
              margin: '24px',
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '0.9rem',
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && employees.length > 0 && (
          <VirtualGrid employees={employees} />
        )}

        {!loading && !error && employees.length === 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9ca3af',
            }}
          >
            No employees found.
          </div>
        )}
      </main>
    </div>
  );
}

export default ListPage;
