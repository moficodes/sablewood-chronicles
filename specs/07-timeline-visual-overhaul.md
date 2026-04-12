# 07 - Timeline Visual Overhaul & Granular Data Plan

## Objective
Refine the Timeline page to align with the "Obsidian Chronicle" visual design constraints, introduce granular time control, restructure timeline data to be fully data-driven, and optimize the filter UX for mobile and desktop screens.

## 1. Data Model & Structure Updates
- **Granular Time (`types/index.ts`)**: Added optional `hour` and `minute` fields to the `GameTime` interface to allow for precise chronological sorting and display.
- **Data-Driven Header (`types/index.ts`, `data.json`)**: 
  - Restructured `data.json` from a root array to an object containing page metadata (`title`, `subtitle`, `description`) and an `events` array.
  - Updated `TimelineData` interface to reflect this structure.
- **Expanded Mock Data**: Added new events to `data.json` spanning multiple arcs (`arc_1_intro`, `arc_2_shadows`, `arc_3_revelation`) and utilizing the new time fields to verify UI changes.

## 2. Utility Enhancements (`app/timeline/utils.ts`)
- **Time Formatting**: Updated `formatGameTime` to append 12-hour AM/PM format if `hour` and `minute` are provided.
- **Type Styling**: Added a `getTypeColor` utility mapping event types (`combat`, `location_change`, `npc_meet`, `achievement`, `drawback`) to specific Tailwind color classes, backgrounds, and glow effects to provide distinct visual signatures.

## 3. UI/UX Changes
### Page Layout (`app/timeline/page.tsx`)
- **Dynamic Headers**: The title ("The Obsidian Chronicle"), subtitle, and description are now dynamically rendered from `data.json`.
- **Arc Grouping**: Events are now visually grouped by `sagaArc`. Each arc starts with a stylized, collapsible banner displaying the arc name.
- **Responsive Spine**: The central timeline line now renders on the left edge (`left-4`) for mobile screens to maximize space, while remaining perfectly centered (`left-1/2`) on desktop screens.
- **Floating Action Button (FAB) Filters**: 
  - Removed the bulky inline filter block at the top of the page.
  - Implemented a sleek FAB in the bottom right corner to toggle the filter menu.
  - **Filter Menu Redesign**: 
    - "Event Type" remains as clickable chips.
    - "Campaign Arc" and "Journal Entries" (PC Notes) were converted into space-saving dropdowns (`<select>`).

### Event Cards (`app/timeline/EventCard.tsx`)
- **Strict Design System Adherence**: Removed 1px borders and heavy container backgrounds, relying instead on spacing and backdrop blurs to establish hierarchy without breaking "The Living Chronicle" aesthetics.
- **Typography & Alignment**: 
  - Adjusted titles to use `font-serif`.
  - Enforced left-aligned text content across all cards for readability, even when the card itself is positioned on the right side of the desktop timeline spine.
- **Type Indicators**: Added stylized badges with Lucide React icons (`MapPin`, `Swords`, `Trophy`, etc.) and event-specific accent colors to the top of each event card.
- **Journal Entries**: Restyled PC Notes to look like distinct journal snippets within the main event card.
