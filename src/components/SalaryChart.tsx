import type { Employee } from '../types';

interface SalaryChartProps {
  employees: Employee[];
  width?: number;
  height?: number;
}

const BAR_PADDING = 0.2; // fraction of bar slot used as gap
const LABEL_HEIGHT = 20;
const AXIS_PADDING = 40;

function SalaryChart({ employees, width = 600, height = 300 }: SalaryChartProps) {
  // Group employees by city and sum salaries
  const cityTotals = employees.reduce<Record<string, number>>((acc, emp) => {
    const city = emp.city ?? 'Unknown';
    acc[city] = (acc[city] ?? 0) + (emp.salary ?? 0);
    return acc;
  }, {});

  const cities = Object.keys(cityTotals);
  const totals = Object.values(cityTotals);
  const maxTotal = totals.length > 0 ? Math.max(...totals) : 1;

  const chartHeight = height - LABEL_HEIGHT - AXIS_PADDING;
  const slotWidth = cities.length > 0 ? width / cities.length : width;
  const barWidth = slotWidth * (1 - BAR_PADDING);

  if (cities.length === 0) {
    return (
      <svg width={width} height={height} aria-label="Salary chart — no data">
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#6b7280" fontSize={14}>
          No employee data available
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      aria-label="Salary distribution by city"
      role="img"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {cities.map((city, i) => {
        const total = cityTotals[city];
        const barHeight = maxTotal > 0 ? (total / maxTotal) * chartHeight : 0;
        const x = i * slotWidth + (slotWidth - barWidth) / 2;
        const y = AXIS_PADDING + (chartHeight - barHeight);

        return (
          <g key={city}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3b82f6"
              rx={3}
            />
            {/* City label below bar */}
            <text
              x={x + barWidth / 2}
              y={height - 4}
              textAnchor="middle"
              fontSize={11}
              fill="#374151"
            >
              {city}
            </text>
            {/* Value label above bar */}
            <text
              x={x + barWidth / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize={10}
              fill="#6b7280"
            >
              {total.toLocaleString()}
            </text>
          </g>
        );
      })}
      {/* Baseline */}
      <line
        x1={0}
        y1={AXIS_PADDING + chartHeight}
        x2={width}
        y2={AXIS_PADDING + chartHeight}
        stroke="#d1d5db"
        strokeWidth={1}
      />
    </svg>
  );
}

export default SalaryChart;
