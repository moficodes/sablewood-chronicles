# Timeline Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vertical timeline page to display campaign events with infinite scrolling and filtering capabilities.

**Architecture:** We will add new types to define timeline events, create a sample JSON data file, and build a React page (`/timeline`) with client-side filtering and infinite scroll loading logic. The timeline will use an alternating (zig-zag) layout on desktop and single-column on mobile.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, TypeScript.

---

### Task 1: Define Data Types

**Files:**
- Modify: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/types/index.ts`

- [ ] **Step 1: Add new types to `types/index.ts`**

Append the following types to the end of the file:

```typescript
export interface GameTime {
  era: string;
  year: number;
  month: string;
  day: number;
}

export type EventType = 'location_change' | 'achievement' | 'drawback' | 'npc_meet' | 'combat' | 'general';
export type SagaArc = 'arc_1_intro' | 'arc_2_shadows' | 'arc_3_revelation';

export interface PCNote {
  pcId: string;
  note: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: GameTime;
  type: EventType;
  sagaArc?: SagaArc;
  description: string;
  pcNotes?: PCNote[];
  locationId?: string;
  npcIds?: string[];
}
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit`
Expected: Clean exit (no errors related to the new types).

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "types: add timeline event data structures"
```

---

### Task 2: Create Sample Data

**Files:**
- Create: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/app/timeline/data.json`

- [ ] **Step 1: Create the directory and file with sample data**

Create `app/timeline/data.json` with the following content:

```json
[
  {
    "id": "evt-001",
    "title": "Arrival at Sablewood",
    "time": {
      "era": "The Second Age",
      "year": 1452,
      "month": "Frostfall",
      "day": 14
    },
    "type": "location_change",
    "sagaArc": "arc_1_intro",
    "description": "The party arrived at the gates of Sablewood, seeking refuge from the storm. The guards were suspicious but eventually let them in after a brief interrogation.",
    "pcNotes": [
      {
        "pcId": "pc-001",
        "note": "The guards seemed more afraid of something inside the woods than us outside. I should keep an eye on them."
      }
    ]
  },
  {
    "id": "evt-002",
    "title": "Meeting the Elder",
    "time": {
      "era": "The Second Age",
      "year": 1452,
      "month": "Frostfall",
      "day": 15
    },
    "type": "npc_meet",
    "sagaArc": "arc_1_intro",
    "description": "An audience with Elder Thorne was granted. He tasked the party with investigating the recent disappearances near the old ruins.",
    "pcNotes": []
  },
  {
    "id": "evt-003",
    "title": "Ambush at the Ruins",
    "time": {
      "era": "The Second Age",
      "year": 1452,
      "month": "Frostfall",
      "day": 17
    },
    "type": "combat",
    "sagaArc": "arc_1_intro",
    "description": "While investigating the ruins, the party was ambushed by a pack of shadow-wolves. They barely managed to fend them off.",
    "pcNotes": [
      {
        "pcId": "pc-002",
        "note": "My spells barely singed their fur. They are resistant to fire. We need a new strategy."
      }
    ]
  },
  {
    "id": "evt-004",
    "title": "Discovery of the Amulet",
    "time": {
      "era": "The Second Age",
      "year": 1452,
      "month": "Frostfall",
      "day": 18
    },
    "type": "achievement",
    "sagaArc": "arc_1_intro",
    "description": "Deep within the ruins, an ancient amulet pulsing with strange energy was found hidden beneath a stone altar."
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add app/timeline/data.json
git commit -m "data: add sample timeline events"
```

---

### Task 3: Create Filter and Format Utilities

**Files:**
- Create: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/app/timeline/utils.ts`

- [ ] **Step 1: Write utility functions for filtering and formatting**

Create `app/timeline/utils.ts`:

```typescript
import { TimelineEvent, GameTime } from '@/types';

export function formatGameTime(time: GameTime): string {
  return `${time.month} ${time.day}, ${time.year} - ${time.era}`;
}

export function filterEvents(
  events: TimelineEvent[],
  filters: {
    type?: string[];
    sagaArc?: string[];
    pcId?: string[];
  }
): TimelineEvent[] {
  return events.filter((event) => {
    // 1. Filter by Type
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(event.type)) return false;
    }

    // 2. Filter by Saga Arc
    if (filters.sagaArc && filters.sagaArc.length > 0) {
      if (!event.sagaArc || !filters.sagaArc.includes(event.sagaArc)) return false;
    }

    // 3. Filter by PC Notes presence
    if (filters.pcId && filters.pcId.length > 0) {
      if (!event.pcNotes || event.pcNotes.length === 0) return false;
      const eventPcIds = event.pcNotes.map((note) => note.pcId);
      const hasMatchingPc = filters.pcId.some((id) => eventPcIds.includes(id));
      if (!hasMatchingPc) return false;
    }

    return true;
  });
}
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit`
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/timeline/utils.ts
git commit -m "feat(timeline): add formatting and filtering utilities"
```

---

### Task 4: Create Timeline Event Card Component

**Files:**
- Create: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/app/timeline/EventCard.tsx`

- [ ] **Step 1: Build the card component**

Create `app/timeline/EventCard.tsx`:

```tsx
import { TimelineEvent } from '@/types';
import { formatGameTime } from './utils';

export function EventCard({ event, align }: { event: TimelineEvent; align: 'left' | 'right' }) {
  // Styles enforce DESIGN.md: no borders, uses surface colors, rounded corners
  return (
    <div className={`w-full md:w-5/12 ${align === 'right' ? 'md:ml-auto' : ''} mb-8`}>
      <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        
        {/* Header: Time and Badges */}
        <div className="flex flex-col gap-2 border-b border-surface-container-highest pb-4">
          <div className="text-sm font-medium text-on-surface-variant">
            {formatGameTime(event.time)}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold capitalize">
              {event.type.replace('_', ' ')}
            </span>
            {event.sagaArc && (
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold capitalize">
                {event.sagaArc.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Body: Title and Description */}
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-2">{event.title}</h3>
          <p className="text-on-surface-variant leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* PC Notes */}
        {event.pcNotes && event.pcNotes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-container-highest flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-on-surface">Journal Entries</h4>
            {event.pcNotes.map((note, idx) => (
              <div key={idx} className="bg-surface rounded-xl p-4 italic text-on-surface-variant text-sm border-l-4 border-primary">
                 "{note.note}"
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit`
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/timeline/EventCard.tsx
git commit -m "ui: build timeline event card component"
```

---

### Task 5: Build Timeline Main Page

**Files:**
- Create: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/app/timeline/page.tsx`

- [ ] **Step 1: Implement the main page with infinite scroll and basic layout**

Create `app/timeline/page.tsx`:

```tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimelineEvent } from '@/types';
import eventsData from './data.json';
import { EventCard } from './EventCard';
import { filterEvents } from './utils';

const EVENTS_PER_PAGE = 5;

export default function TimelinePage() {
  const [allEvents] = useState<TimelineEvent[]>(eventsData as TimelineEvent[]);
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);
  const [page, setPage] = useState(1);
  
  // Minimal filter state for now, UI added in next task
  const [filters] = useState({ type: [], sagaArc: [], pcId: [] });

  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredEvents = filterEvents(allEvents, filters);

  useEffect(() => {
    // Reset when filters change
    setVisibleEvents(filteredEvents.slice(0, EVENTS_PER_PAGE));
    setPage(1);
  }, [filteredEvents]);

  const loadMore = useCallback(() => {
    const nextEvents = filteredEvents.slice(
      page * EVENTS_PER_PAGE,
      (page + 1) * EVENTS_PER_PAGE
    );
    if (nextEvents.length > 0) {
      setVisibleEvents((prev) => [...prev, ...nextEvents]);
      setPage((p) => p + 1);
    }
  }, [page, filteredEvents]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-on-surface mb-8 text-center">Chronicles</h1>
      
      {/* Filters Placeholder */}
      <div className="mb-12 p-4 bg-surface-container rounded-2xl">
         <p className="text-center text-on-surface-variant">Filters will go here</p>
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* The central spine (hidden on mobile, visible on md+) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-surface-container-highest transform -translate-x-1/2"></div>

        <div className="flex flex-col">
          {visibleEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Spine node indicator */}
              <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 z-10 border-4 border-background"></div>
              <EventCard 
                event={event} 
                align={index % 2 === 0 ? 'left' : 'right'} 
              />
            </div>
          ))}
        </div>

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10 w-full" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit`
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/timeline/page.tsx
git commit -m "ui: implement timeline page with alternating layout and infinite scroll"
```

---

### Task 6: Add Filter UI Controls

**Files:**
- Modify: `/Users/mofi/Documents/github.com/moficodes/sablewood-chronicles/app/timeline/page.tsx`

- [ ] **Step 1: Replace filter placeholder with actual controls**

Update `app/timeline/page.tsx` to include basic filter toggles. We will use simple native select/buttons for now to avoid introducing external UI libraries, keeping styling aligned with `DESIGN.md`.

Edit `app/timeline/page.tsx`:

```tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimelineEvent, EventType, SagaArc } from '@/types';
import eventsData from './data.json';
import { EventCard } from './EventCard';
import { filterEvents } from './utils';

const EVENTS_PER_PAGE = 5;

// Extract unique values for filters
const EVENT_TYPES = Array.from(new Set(eventsData.map(e => e.type))) as EventType[];
const SAGA_ARCS = Array.from(new Set(eventsData.map(e => e.sagaArc).filter(Boolean))) as SagaArc[];
// Assuming some known PC IDs for filter demo based on sample data
const PC_IDS = ["pc-001", "pc-002"]; 

export default function TimelinePage() {
  const [allEvents] = useState<TimelineEvent[]>(eventsData as TimelineEvent[]);
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState<{type: string[], sagaArc: string[], pcId: string[]}>({ 
    type: [], 
    sagaArc: [], 
    pcId: [] 
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  // Re-run filter whenever allEvents or filters state changes
  // Using JSON.stringify(filters) in dep array prevents infinite loops since objects are referenced by memory
  const filteredEvents = useCallback(() => filterEvents(allEvents, filters), [allEvents, filters]);

  useEffect(() => {
    const currentFiltered = filteredEvents();
    setVisibleEvents(currentFiltered.slice(0, EVENTS_PER_PAGE));
    setPage(1);
  }, [filteredEvents]);

  const loadMore = useCallback(() => {
    const currentFiltered = filteredEvents();
    const nextEvents = currentFiltered.slice(
      page * EVENTS_PER_PAGE,
      (page + 1) * EVENTS_PER_PAGE
    );
    if (nextEvents.length > 0) {
      setVisibleEvents((prev) => [...prev, ...nextEvents]);
      setPage((p) => p + 1);
    }
  }, [page, filteredEvents]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-on-surface mb-8 text-center">Chronicles</h1>
      
      {/* Filter Controls */}
      <div className="mb-12 p-6 bg-surface-container rounded-2xl flex flex-col gap-6">
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

      {/* Timeline Layout */}
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-surface-container-highest transform -translate-x-1/2"></div>

        <div className="flex flex-col">
          {visibleEvents.length === 0 ? (
            <p className="text-center text-on-surface-variant py-12">No events match the selected filters.</p>
          ) : (
            visibleEvents.map((event, index) => (
              <div key={event.id} className="relative">
                <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 z-10 border-4 border-background"></div>
                <EventCard 
                  event={event} 
                  align={index % 2 === 0 ? 'left' : 'right'} 
                />
              </div>
            ))
          )}
        </div>

        <div ref={observerTarget} className="h-10 w-full" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check for compilation errors**

Run: `bun run tsc --noEmit`
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add app/timeline/page.tsx
git commit -m "ui: implement filter controls for timeline"
```