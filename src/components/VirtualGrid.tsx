import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizerWithScroll } from '../hooks/useVirtualizer';
import EmployeeRow from './EmployeeRow';
import type { Employee } from '../types';

const ROW_HEIGHT = 60;

interface VirtualGridProps {
  employees: Employee[];
}

function VirtualGrid({ employees }: VirtualGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const navigate = useNavigate();

  // Measure container height via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { visibleRange, totalHeight, handleScroll } = useVirtualizerWithScroll({
    totalCount: employees.length,
    rowHeight: ROW_HEIGHT,
    containerHeight,
  });

  const visibleEmployees: { employee: Employee; index: number }[] = [];
  for (let i = visibleRange.start; i <= visibleRange.end; i++) {
    if (employees[i]) {
      visibleEmployees.push({ employee: employees[i], index: i });
    }
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          height: `${ROW_HEIGHT}px`,
          borderBottom: '2px solid #d1d5db',
          backgroundColor: '#f9fafb',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: '#374151',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ flex: '2' }}>Name</span>
        <span style={{ flex: '1' }}>City</span>
        <span style={{ flex: '1', textAlign: 'right' }}>Salary</span>
      </div>

      {/* Scrollable content area */}
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleEmployees.map(({ employee, index }) => (
          <EmployeeRow
            key={employee.id}
            employee={employee}
            style={{
              position: 'absolute',
              top: `${index * ROW_HEIGHT}px`,
              left: 0,
              right: 0,
              height: `${ROW_HEIGHT}px`,
            }}
            onClick={() => navigate(`/details/${employee.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default VirtualGrid;
