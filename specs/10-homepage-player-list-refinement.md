# Homepage Player List Refinement Design

## Objective
Refine the player list section on the homepage to improve usability and visuals. Specifically, center the list on large screens, fix image clipping during hover effects, and replace the mobile horizontal scroll with a button-driven carousel.

## Scope
- Modify the player list section in `app/page.tsx` or extract it into a client component.
- Implement responsive rendering: static centered list for desktop, interactive carousel for mobile.

## Architecture & Approach

### 1. Fixing the Clipping and Centering (Desktop)
- The existing container uses `overflow-x-auto` which causes clipping on vertical translation/scaling (`hover:-translate-y-1` and `ring-4`).
- We will add ample vertical padding (e.g., `pt-6 pb-4`) to the inner wrapper.
- We will apply `justify-center` to the flex row so the player cards are centrally aligned horizontally.
- The desktop view will be visible on medium screens and up (`hidden md:flex`).

### 2. Mobile Carousel (Small Screens)
- We will build a new React component or section within the page for the mobile view, visible only on small screens (`flex md:hidden`).
- **Interaction**: Button-driven carousel using Next and Previous arrow buttons.
- **State Management**: A simple `currentIndex` state will dictate which player(s) are visible.
- **Animation**: The carousel will use a CSS `transform: translateX(...)` with a smooth transition class for sliding between players.
- **Constraints**: 
  - Arrows will be styled using existing design system patterns (e.g., surface-container-high background with on-surface icons, minimum 1rem border radius).
  - No sharp corners, pure blacks, or 1px dividers per `DESIGN.md`.

## Data Flow
- The `players` data is already imported via `@/data/players.json`.
- The new carousel will iterate through this existing array exactly as the desktop view does.

## Future Considerations
- If the player count grows significantly, the carousel approach on mobile will continue to scale well. Desktop may eventually need to wrap or adopt the carousel, but for now, centering is sufficient.
