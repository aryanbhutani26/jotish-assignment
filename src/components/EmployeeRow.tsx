import type { Employee } from '../types';

interface EmployeeRowProps {
  employee: Employee;
  style?: React.CSSProperties;
  onClick: () => void;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  borderBottom: '1px solid #e5e7eb',
  cursor: 'pointer',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
  gap: '16px',
};

const hoverStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
};

const cellStyle: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

function EmployeeRow({ employee, style, onClick }: EmployeeRowProps) {
  return (
    <div
      style={{ ...rowStyle, ...style }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = hoverStyle.backgroundColor!;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = rowStyle.backgroundColor!;
      }}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <span style={{ ...cellStyle, flex: '2', fontWeight: 500 }}>{employee.name}</span>
      <span style={{ ...cellStyle, flex: '1', color: '#6b7280' }}>{employee.city}</span>
      <span style={{ ...cellStyle, flex: '1', textAlign: 'right', color: '#059669' }}>
        ${Number(employee.salary).toLocaleString()}
      </span>
    </div>
  );
}

export default EmployeeRow;
