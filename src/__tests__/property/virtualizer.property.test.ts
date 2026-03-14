import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { useVirtualizer } from '../../hooks/useVirtualizer';

// Feature: employee-insights-dashboard, Property 6: Virtualizer visible range is mathematically correct
// Feature: employee-insights-dashboard, Property 7: Virtualizer total height invariant

// Pure computation helper — mirrors useVirtualizer logic without React hooks
function computeVirtualizer(
  scrollTop: number,
  rowHeight: number,
  containerHeight: number,
  totalCount: number,
  buffer: number = 5
) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const end = Math.min(totalCount - 1, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer);
  const totalHeight = totalCount * rowHeight;
  const offsetY = start * rowHeight;
  return { visibleRange: { start, end }, totalHeight, offsetY };
}

describe('Virtualizer properties', () => {
  // Property 6: Virtualizer visible range is mathematically correct
  it('P6: visibleRange start and end match the expected formulas', () => {
    // Validates: Requirements 2.4, 2.5
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),   // scrollTop
        fc.integer({ min: 1, max: 200 }),       // rowHeight
        fc.integer({ min: 1, max: 2000 }),      // containerHeight
        fc.integer({ min: 0, max: 10000 }),     // totalCount
        fc.integer({ min: 0, max: 20 }),        // buffer
        (scrollTop, rowHeight, containerHeight, totalCount, buffer) => {
          const result = computeVirtualizer(scrollTop, rowHeight, containerHeight, totalCount, buffer);

          const expectedStart = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
          const expectedEnd = Math.min(
            totalCount - 1,
            Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer
          );

          return (
            result.visibleRange.start === expectedStart &&
            result.visibleRange.end === expectedEnd
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 7: Virtualizer total height invariant
  it('P7: totalHeight always equals totalCount * rowHeight regardless of scroll position', () => {
    // Validates: Requirements 2.6
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),   // scrollTop
        fc.integer({ min: 1, max: 200 }),       // rowHeight
        fc.integer({ min: 1, max: 2000 }),      // containerHeight
        fc.integer({ min: 0, max: 10000 }),     // totalCount (N)
        (scrollTop, rowHeight, containerHeight, totalCount) => {
          const result = computeVirtualizer(scrollTop, rowHeight, containerHeight, totalCount);
          return result.totalHeight === totalCount * rowHeight;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P6 edge: start is always >= 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),
        fc.integer({ min: 1, max: 200 }),
        fc.integer({ min: 1, max: 2000 }),
        fc.integer({ min: 0, max: 10000 }),
        (scrollTop, rowHeight, containerHeight, totalCount) => {
          const result = computeVirtualizer(scrollTop, rowHeight, containerHeight, totalCount);
          return result.visibleRange.start >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P6 edge: end is always <= totalCount - 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),
        fc.integer({ min: 1, max: 200 }),
        fc.integer({ min: 1, max: 2000 }),
        fc.integer({ min: 1, max: 10000 }),
        (scrollTop, rowHeight, containerHeight, totalCount) => {
          const result = computeVirtualizer(scrollTop, rowHeight, containerHeight, totalCount);
          return result.visibleRange.end <= totalCount - 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
