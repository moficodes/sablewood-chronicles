# Timeline Page & Data Specification

## Overview
A new page to display a vertical timeline of campaign events. This will allow users to track the progression of the story, filter events by type, narrative arc, or involved player characters, and read PC journal entries associated with specific events.

## Data Structure

New types will be added to `types/index.ts`. The data will be sourced from a JSON file (e.g., `app/timeline/data.json`).

```typescript
export interface GameTime {
  era: string; 
  year: number;
  month: string;
  day: number;
}

export type EventType = 'location_change' | 'achievement' | 'drawback' | 'npc_meet' | 'combat' | 'general';
export type SagaArc = 'arc_1_intro' | 'arc_2_shadows' | 'arc_3_revelation'; // To be expanded as needed

export interface PCNote {
  pcId: string; // Links to Player.id
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
  locationId?: string; // Optional link to Location.id
  npcIds?: string[]; // Optional link to NPC.id(s)
}
```

## UI/UX Design

### Page Layout (`app/timeline/page.tsx`)
- **Filter Controls:** A sticky header section containing dropdowns or multi-select toggles for filtering by:
  - Event Type
  - Saga / Arc
  - Player Character (PC Notes)
- **Timeline Structure:**
  - **Desktop:** Alternating (zig-zag) vertical timeline. A central visual spine with event cards alternating left and right.
  - **Mobile:** Single column, left-aligned vertical timeline.
- **Data Loading:** Infinite scrolling. Since data is local JSON, the component will load an initial chunk (e.g., 10 events) and append the next chunk to the rendered list as the user scrolls near the bottom of the current list.

### Event Cards
Each event on the timeline is represented by a card containing:
- **Time Header:** Formatted `GameTime`.
- **Title:** The name of the event.
- **Badges:** Visual indicators showing the event's `type` and `sagaArc` to aid quick scanning.
- **Description:** Narrative text of what occurred.
- **Journal Entries (PC Notes):** A visually distinct sub-section within the card (e.g., inset background) displaying quotes/notes, attributed to specific PCs.

### Design System Compliance (`DESIGN.md`)
- **No Borders:** Timeline spine and card edges will be defined by background color contrasts (e.g., `surface` vs `surface-container`), not borders.
- **Depth:** Cards will use overlapping elements or subtle drop shadows/blurs (if permitted by design system) to sit "above" the page surface.
- **Radii:** All cards and badges will use minimum `1rem` border radius (`rounded-2xl` or higher).
- **Colors:** Text and icons will strictly avoid `#000000`, utilizing `on-surface` or primary brand colors instead.

## Implementation Steps
1. Define the new TypeScript interfaces in `types/index.ts`.
2. Create a sample data file (`app/timeline/data.json`) with a few varied events to test rendering and filtering.
3. Build the core `Timeline` and `TimelineEventCard` components.
4. Implement the filter state logic.
5. Implement the infinite scroll loading logic (using native Intersection Observer or simple scroll event listener on a bounded array).
6. Integrate the page into the main application navigation.