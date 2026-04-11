# Plan 03: NPC Data Updates and Details Page

## Objective
Enhance the existing NPC system by adding images, attitudes, and interaction history, updating the list view, and creating a dedicated NPC details page.

## Data Model Changes (`types/index.ts` & `app/npcs/data.json`)
- **Image Field:** Add an optional `image` string (URL or local path) to the `NPC` interface.
- **Attitude Field:** Add an optional `attitudeTowardParty` string.
- **Memorable Interactions:** Add an optional `memorableInteractions` array. Each interaction includes:
  - `description` (string)
  - `highlight` (optional string)
  - `pcInvolved` (optional string)

## UI Updates
1. **NPC List Page (`app/npcs/page.tsx`)**:
   - Update cards to include the NPC image (or a fallback letter monogram if missing).
   - Display name, role, and location.
   - Wrap each card in a `<Link>` pointing to `/npcs/[id]`.

2. **NPC Details Page (`app/npcs/[id]/page.tsx`)**:
   - Implement a new dynamic route for individual NPCs.
   - **Sidebar/Header Card:** Show the NPC portrait, name, role, location, and `attitudeTowardParty`.
   - **Main Content:** Show the NPC description ("About") in a card.
   - **Interactions Section:** Render a list of cards for `memorableInteractions`, displaying the description, highlight text, and involved PCs.

## Design System Considerations
- Strict adherence to `DESIGN.md` guidelines.
- No 1px borders; use nested surface background colors (`surface-container-low`, `surface-container`, `surface-container-high`) to create boundaries and depth.
- No pure black text; use `text-on-surface` and `text-secondary` for legibility.
- Use large rounded corners (`rounded-[1.5rem]`, `rounded-[2rem]`) and avoid sharp edges.

## Setup & Configuration
- Update `next.config.ts` to allow unoptimized external image URLs (e.g., Unsplash) for static exports.
- Implement `generateStaticParams()` in `app/npcs/[id]/page.tsx` for static site generation compatibility.