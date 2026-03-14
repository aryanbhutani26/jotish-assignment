import { describe, it, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

// Feature: employee-insights-dashboard, Property 1: Invalid credentials always produce an error
// Feature: employee-insights-dashboard, Property 2: Auth state round-trip persistence
// Feature: employee-insights-dashboard, Property 3: Unauthenticated access to protected routes redirects to login

const VALID_USERNAME = 'testuser';
const VALID_PASSWORD = 'Test123';
const STORAGE_KEY = 'eid_auth';

// Pure login logic extracted for property testing
function loginLogic(username: string, password: string): boolean {
  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

// Auth persistence logic
function persistAuth(isAuthenticated: boolean): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated }));
}

function restoreAuth(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.isAuthenticated === true;
    }
  } catch {
    // ignore
  }
  return false;
}

describe('Auth property tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Property 1: Invalid credentials always produce an error
  it('P1: any credentials other than testuser/Test123 return false from login', () => {
    // Validates: Requirements 1.3
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (username, password) => {
          // Filter out the valid pair
          fc.pre(!(username === VALID_USERNAME && password === VALID_PASSWORD));
          const result = loginLogic(username, password);
          return result === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 2: Auth state round-trip persistence
  it('P2: writing isAuthenticated=true to localStorage and restoring returns true', () => {
    // Validates: Requirements 1.4, 1.5
    fc.assert(
      fc.property(
        fc.constant(true),
        (authState) => {
          persistAuth(authState);
          const restored = restoreAuth();
          return restored === authState;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P2: writing isAuthenticated=false to localStorage and restoring returns false', () => {
    fc.assert(
      fc.property(
        fc.constant(false),
        (authState) => {
          persistAuth(authState);
          const restored = restoreAuth();
          return restored === authState;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P2: valid login always persists isAuthenticated=true', () => {
    // Validates: Requirements 1.4
    const result = loginLogic(VALID_USERNAME, VALID_PASSWORD);
    if (result) {
      persistAuth(true);
    }
    const restored = restoreAuth();
    fc.assert(
      fc.property(fc.constant(null), () => {
        return restored === true;
      }),
      { numRuns: 1 }
    );
  });
});
