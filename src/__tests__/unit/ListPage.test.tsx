import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { AuditProvider } from '../../contexts/AuditContext';
import ListPage from '../../pages/ListPage';

// Mock the employee API
vi.mock('../../api/employeeApi', () => ({
  fetchEmployees: vi.fn(),
}));

import { fetchEmployees } from '../../api/employeeApi';
const mockFetchEmployees = vi.mocked(fetchEmployees);

function renderListPage() {
  return render(
    <AuthProvider>
      <AuditProvider>
        <MemoryRouter>
          <ListPage />
        </MemoryRouter>
      </AuditProvider>
    </AuthProvider>
  );
}

describe('ListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls fetchEmployees on mount', async () => {
    mockFetchEmployees.mockResolvedValue([]);
    renderListPage();
    await waitFor(() => expect(mockFetchEmployees).toHaveBeenCalledTimes(1));
  });

  it('displays error message when API fails', async () => {
    mockFetchEmployees.mockRejectedValue(new Error('Network error'));
    renderListPage();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert').textContent).toContain('Network error');
  });

  it('displays employees when API succeeds', async () => {
    const employees = [
      { id: '1', name: 'Alice', city: 'Mumbai', salary: 50000 },
      { id: '2', name: 'Bob', city: 'Delhi', salary: 60000 },
    ];
    mockFetchEmployees.mockResolvedValue(employees);
    renderListPage();
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });
});
