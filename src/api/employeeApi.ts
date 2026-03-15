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

  // API returns { TABLE_DATA: { data: [name, dept, city, id, date, salary][] } }
  const rows =
    data != null &&
    typeof data === 'object' &&
    'TABLE_DATA' in data &&
    (data as Record<string, unknown>).TABLE_DATA != null &&
    typeof (data as Record<string, unknown>).TABLE_DATA === 'object' &&
    'data' in ((data as Record<string, unknown>).TABLE_DATA as object)
      ? ((data as Record<string, { data: unknown }>).TABLE_DATA.data)
      : null;

  if (!Array.isArray(rows)) {
    throw new Error('Malformed response: expected an array of employees');
  }

  return rows.map((row: unknown, index: number): Employee => {
    if (Array.isArray(row)) {
      const salaryStr = String(row[5] ?? '0').replace(/[$,]/g, '');
      return {
        id: String(row[3] ?? index),
        name: String(row[0] ?? ''),
        department: String(row[1] ?? ''),
        city: String(row[2] ?? ''),
        salary: parseFloat(salaryStr) || 0,
      };
    }
    // Already an object (future-proofing)
    return row as Employee;
  });
}
