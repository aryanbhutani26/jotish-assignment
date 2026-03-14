# Employee Insights Dashboard

A React + TypeScript single-page application demonstrating core browser APIs (MediaDevices, Canvas 2D, localStorage) and React primitives (Context, Router, custom hooks) — without UI component libraries, virtualization libraries, or charting libraries.

## Screens

| Route | Description |
|---|---|
| `/` | Login page |
| `/list` | Virtualized employee grid |
| `/details/:id` | Employee details, camera capture, signature overlay |
| `/analytics` | Merged audit image, SVG salary chart, city map |

---

## Setup and Running

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Login credentials

```
Username: testuser
Password: Test123
```

---

## Known Intentional Bug (Requirement 5.6)

**Location**: `src/hooks/useVirtualizer.ts`

**Description**: The `useVirtualizer` hook returns a plain object literal on every call without wrapping it in `useMemo`. Because JavaScript creates a new object reference on every render, React's referential equality check treats the result as changed even when the underlying values (`visibleRange`, `totalHeight`, `offsetY`) are identical.

**Effect**: Every scroll event triggers a re-render of the `VirtualGrid` component, which in turn re-renders all currently visible `EmployeeRow` components — even rows whose data has not changed. At scale (hundreds of visible rows), this causes measurable jank during scrolling.

**What a fix would look like**: Wrapping the return value in `useMemo` with `[scrollTop, rowHeight, containerHeight, totalCount, buffer]` as dependencies would ensure a stable object reference is returned whenever the inputs are unchanged, preventing the unnecessary `EmployeeRow` re-renders.

**This bug is intentional and must not be fixed** — it is a documented requirement of the project.

---

## Virtualization Math

The custom `useVirtualizer` hook (`src/hooks/useVirtualizer.ts`) computes which rows to render based on the current scroll position. All formulas use a configurable `buffer` (default: 5 rows) to pre-render rows just outside the viewport, preventing blank flashes during fast scrolling.

### Inputs

| Variable | Description |
|---|---|
| `scrollTop` | Current vertical scroll offset of the container (px) |
| `rowHeight` | Fixed height of every row (px) |
| `containerHeight` | Visible height of the scroll container (px), measured via `ResizeObserver` |
| `totalCount` | Total number of employee records |
| `buffer` | Number of extra rows to render above and below the viewport (default: 5) |

### Formulas

```
start       = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer)
end         = Math.min(totalCount - 1, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer)
totalHeight = totalCount * rowHeight
offsetY     = start * rowHeight
```

### How the grid uses these values

- The outer container div is given `height: totalHeight` so the browser renders a full-size scrollbar.
- Only rows in the range `[start, end]` are mounted in the DOM.
- Each visible row is absolutely positioned with `top: index * rowHeight`.
- `offsetY` is the `top` value of the first visible row, keeping rendered rows aligned with the scroll position.

---

## CITY_COORDS Lookup (Requirement 4.7)

The `CityMap` component (`src/components/CityMap.tsx`) uses [Leaflet](https://leafletjs.com/) to display a marker for each city present in the employee dataset. Because the Employee API returns city names as plain strings (not coordinates), a static lookup table is used to resolve geographic positions.

**File**: `src/constants/cityCoords.ts`

```ts
const CITY_COORDS: Record<string, [number, number]> = {
  "Mumbai":    [19.076, 72.877],
  "Delhi":     [28.704, 77.102],
  "Bangalore": [12.972, 77.594],
  "Chennai":   [13.083, 80.270],
  "Hyderabad": [17.385, 78.487],
  "Kolkata":   [22.573, 88.364],
  "Pune":      [18.520, 73.856],
  // ... additional cities added based on actual API data
};
```

**Lookup strategy**:

1. The `CityMap` component iterates over the unique city values in the employee records.
2. For each city, it performs a direct key lookup: `CITY_COORDS[cityName]`.
3. If the city is found, a `L.marker([lat, lng])` is added to the Leaflet map.
4. If the city is **not** found in the table, it is silently skipped — no crash, no error message.

**Adding new cities**: Extend `CITY_COORDS` in `src/constants/cityCoords.ts` with the city name exactly as it appears in the API response (case-sensitive) and its `[latitude, longitude]` tuple.

---

## Architecture Overview

```
src/
  api/            # Employee API fetch utility
  components/     # VirtualGrid, EmployeeRow, CameraInterface, SignatureCanvas, SalaryChart, CityMap
  constants/      # cityCoords.ts (CITY_COORDS lookup table)
  contexts/       # AuthContext, AuditContext
  hooks/          # useVirtualizer (contains intentional bug)
  pages/          # LoginPage, ListPage, DetailsPage, AnalyticsPage
  types/          # Shared TypeScript interfaces
  __tests__/
    unit/         # Component and integration unit tests
    property/     # fast-check property-based tests
```

### Key constraints

- No UI component libraries (MUI, Ant Design, Bootstrap, etc.)
- No third-party virtualization libraries (react-window, react-virtualized)
- No third-party charting libraries (Chart.js, D3) for the SVG salary chart
- Styling via Tailwind CSS or CSS Modules only
- Authentication state persisted to `localStorage` under key `eid_auth`
