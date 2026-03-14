import { useState } from 'react';
import type { VirtualizerOptions, VirtualizerResult } from '../types';

type UseVirtualizerOptions = VirtualizerOptions & { scrollTop: number };

export function useVirtualizer(options: UseVirtualizerOptions): VirtualizerResult {
  const { totalCount, rowHeight, containerHeight, buffer = 5, scrollTop } = options;

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const end = Math.min(totalCount - 1, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer);
  const totalHeight = totalCount * rowHeight;
  const offsetY = start * rowHeight;

  // INTENTIONAL BUG (Requirement 5.6): result object is returned directly without useMemo.
  // A new object reference is created on every render, causing all visible EmployeeRow
  // components to re-render unnecessarily even when the visible range hasn't changed.
  return {
    visibleRange: { start, end },
    totalHeight,
    offsetY,
  };
}

/**
 * Stateful variant that manages scrollTop internally and exposes a scroll handler.
 * Consumers can use this when they want the hook to own scroll state.
 */
export function useVirtualizerWithScroll(
  options: VirtualizerOptions
): VirtualizerResult & { scrollTop: number; handleScroll: (e: React.UIEvent<HTMLElement>) => void } {
  const [scrollTop, setScrollTop] = useState(0);

  const result = useVirtualizer({ ...options, scrollTop });

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return { ...result, scrollTop, handleScroll };
}
