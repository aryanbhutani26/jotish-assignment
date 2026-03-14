import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { AuditProvider, useAudit } from '../../contexts/AuditContext';
import DetailsPage from '../../pages/DetailsPage';
import type { Employee } from '../../types';
import { useEffect } from 'react';

// Helper to pre-populate AuditContext with employees
function AuditSeeder({ employees, children }: { employees: Employee[]; children: React.ReactNode }) {
  const { setEmployees } = useAudit();
  useEffect(() => {
    setEmployees(employees);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

function renderDetailsPage(id: string, employees: Employee[]) {
  return render(
    <AuthProvider>
      <AuditProvider>
        <AuditSeeder employees={employees}>
          <MemoryRouter initialEntries={[`/details/${id}`]}>
            <Routes>
              <Route path="/details/:id" element={<DetailsPage />} />
              <Route path="/list" element={<div>List Page</div>} />
            </Routes>
          </MemoryRouter>
        </AuditSeeder>
      </AuditProvider>
    </AuthProvider>
  );
}

describe('DetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows not-found message when employees array is empty', () => {
    render(
      <AuthProvider>
        <AuditProvider>
          <MemoryRouter initialEntries={['/details/1']}>
            <Routes>
              <Route path="/details/:id" element={<DetailsPage />} />
              <Route path="/list" element={<div>List Page</div>} />
            </Routes>
          </MemoryRouter>
        </AuditProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/no employee data available/i)).toBeInTheDocument();
  });

  it('shows not-found message for unknown id', async () => {
    const employees: Employee[] = [
      { id: '1', name: 'Alice', city: 'Mumbai', salary: 50000 },
    ];
    renderDetailsPage('999', employees);
    await waitFor(() => {
      expect(screen.getByText(/employee not found/i)).toBeInTheDocument();
    });
  });

  it('renders employee info for valid id', async () => {
    const employees: Employee[] = [
      { id: '42', name: 'Alice Smith', city: 'Mumbai', salary: 75000 },
    ];
    renderDetailsPage('42', employees);
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
  });

  it('renders camera activation button when employee is found', async () => {
    const employees: Employee[] = [
      { id: '1', name: 'Bob', city: 'Delhi', salary: 60000 },
    ];
    renderDetailsPage('1', employees);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /activate camera/i })).toBeInTheDocument();
    });
  });
});

describe('CameraInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getUserMedia on activation', async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      writable: true,
      configurable: true,
    });

    const { default: CameraInterface } = await import('../../components/CameraInterface');
    const { unmount } = render(
      <CameraInterface
        onCapture={vi.fn()}
        onError={vi.fn()}
      />
    );

    await waitFor(() => expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true }));
    unmount();
  });

  it('calls onError with correct message when permission is denied', async () => {
    const onError = vi.fn();
    const notAllowedError = new DOMException('Permission denied', 'NotAllowedError');
    const mockGetUserMedia = vi.fn().mockRejectedValue(notAllowedError);
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      writable: true,
      configurable: true,
    });

    const { default: CameraInterface } = await import('../../components/CameraInterface');
    const { unmount } = render(
      <CameraInterface
        onCapture={vi.fn()}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        'Camera access was denied. Please allow camera permissions and try again.'
      );
    });
    unmount();
  });
});
