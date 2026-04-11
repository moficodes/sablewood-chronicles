# Timeline Polish and Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the timeline filter card collapsible and add global navigation links to the timeline page.

**Architecture:** We will modify `app/timeline/page.tsx` to add a controlled toggle for the filter section. We will also update `app/components/navbar.tsx` to include "Timeline" in the `NAV_LINKS` array, and update `app/page.tsx` to add a new card linking to the timeline in the homepage grid.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, Lucide React (for icons).

---

### Task 1: Add Global Navigation Link

**Files:**
- Modify: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/.worktrees/timeline-polish/app/components/navbar.tsx`

- [ ] **Step 1: Add "Timeline" to NAV_LINKS**

Modify `app/components/navbar.tsx` to include the Timeline link. Insert it after "Locations".

```typescript
// Find this section:
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Players", href: "/players" },
  { name: "NPCs", href: "/npcs" },
  { name: "Locations", href: "/locations" },
  { name: "Timeline", href: "/timeline" },
];
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit` in the worktree directory.
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/components/navbar.tsx
git commit -m "nav: add timeline link to global navbar"
```

---

### Task 2: Add Homepage Integration

**Files:**
- Modify: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/.worktrees/timeline-polish/app/page.tsx`

- [ ] **Step 1: Update the homepage grid to include the Timeline link**

Modify `app/page.tsx` to change the grid layout to accommodate 4 items (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) and add the new card.

```tsx
// Update the grid container class:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

// Add this block inside the grid, after Locations:
            <div className="bg-surface-container-lowest p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-primary-dim mb-2">Chronicles</h3>
              <p className="text-on-surface mb-4">Review the timeline of events, battles, and discoveries.</p>
              <Link href="/timeline" className="text-secondary font-bold hover:text-secondary-container transition-colors">View Timeline &rarr;</Link>
            </div>
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit` in the worktree directory.
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): add link to timeline page"
```

---

### Task 3: Make Timeline Filter Collapsible

**Files:**
- Modify: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/.worktrees/timeline-polish/app/timeline/page.tsx`

- [ ] **Step 1: Add collapse state and toggle UI**

Update `app/timeline/page.tsx` to manage an `isFiltersOpen` state and wrap the filter content in a conditional render. We'll use the `Filter` and `ChevronDown` / `ChevronUp` icons from `lucide-react`.

Add to imports:
```tsx
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
```

Add to component state:
```tsx
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
```

Update the `Filter Controls` section in the return statement:
```tsx
      {/* Filter Controls */}
      <div className="mb-12">
        <button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-2xl transition-colors mx-auto text-on-surface font-semibold"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {isFiltersOpen ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
        </button>

        {isFiltersOpen && (
          <div className="mt-6 p-6 bg-surface-container rounded-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* The rest of the existing filter UI goes here: Filter by Type, Filter by Arc, Filter by PC Notes */}
            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Filter by Type</h3>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(type => (
                  <button 
                    key={type}
                    onClick={() => toggleFilter('type', type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filters.type.includes(type) ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Filter by Arc</h3>
              <div className="flex flex-wrap gap-2">
                {SAGA_ARCS.map(arc => (
                  <button 
                    key={arc}
                    onClick={() => toggleFilter('sagaArc', arc)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filters.sagaArc.includes(arc) ? 'bg-secondary text-on-secondary' : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {arc.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-3">Filter by PC Notes</h3>
              <div className="flex flex-wrap gap-2">
                {PC_IDS.map(id => (
                  <button 
                    key={id}
                    onClick={() => toggleFilter('pcId', id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filters.pcId.includes(id) ? 'bg-tertiary text-on-tertiary' : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit` in the worktree directory.
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/timeline/page.tsx
git commit -m "ui: make timeline filters collapsible"
```