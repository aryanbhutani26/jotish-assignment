import type { Employee } from '../types';

const API_URL = 'https://backend.jotish.in/backend_dev/gettabledata.php';
const CREDENTIALS = { username: 'test', password: '123456' };

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Malformed response: expected an array of employees');
  }

  return data as Employee[];
}
