import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Helper component to expose AuthContext values
function AuthConsumer() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
      <button onClick={() => login('testuser', 'Test123')} data-testid="login-valid">Login Valid</button>
      <button onClick={() => login('wrong', 'wrong')} data-testid="login-invalid">Login Invalid</button>
      <button onClick={logout} data-testid="logout">Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated when localStorage is empty', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe('unauthenticated');
  });

  it('authenticates with valid credentials', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByTestId('login-valid'));
    expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');
  });

  it('does not authenticate with invalid credentials', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByTestId('login-invalid'));
    expect(screen.getByTestId('auth-status').textContent).toBe('unauthenticated');
  });

  it('persists auth state to localStorage on login', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByTestId('login-valid'));
    const stored = JSON.parse(localStorage.getItem('eid_auth') || '{}');
    expect(stored.isAuthenticated).toBe(true);
  });

  it('restores auth state from localStorage on mount', () => {
    localStorage.setItem('eid_auth', JSON.stringify({ isAuthenticated: true }));
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');
  });

  it('clears auth state on logout', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByTestId('login-valid'));
    fireEvent.click(screen.getByTestId('logout'));
    expect(screen.getByTestId('auth-status').textContent).toBe('unauthenticated');
    expect(localStorage.getItem('eid_auth')).toBeNull();
  });
});

describe('LoginPage rendering', () => {
  it('renders username field, password field, and submit button', async () => {
    const { default: LoginPage } = await import('../../pages/LoginPage');
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error message on invalid credentials', async () => {
    const { default: LoginPage } = await import('../../pages/LoginPage');
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
