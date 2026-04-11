# Player Data Update for Daggerheart

## Overview
Update the player data structure and UI in the Sablewood Chronicles application to support the Daggerheart tabletop roleplaying system, moving away from D&D conventions.

## Data Structure Changes

The `Player` datatype (currently implicitly defined in `app/players/data.json` and used in `app/players/page.tsx`) needs to be updated.

### Removals/Changes
- Change `race` to `ancestry` (String).
- Change `stats` object keys from `str, dex, con, int, wis, cha` to `Agility, Strength, Finesse, Instinct, Presence, Knowledge` (Numbers).

### Additions
- `community` (String)
- `tier` (Number or String, e.g., 1)
- `subclass` (String)
- `image` (String - URL to static file or web image)
- `backgroundQuestions` (Array of Objects: `{ question: string, answer: string }`)
- `connectionQuestions` (Array of Objects: `{ question: string, answer: string }`)

*Note: Since there isn't a TypeScript definition file for `Player`, we will create one to enforce these types.*

## UI Changes (`app/players/page.tsx`)

### Card View (The Party Page)
Update the grid cards to display the new data using the "Living Chronicle" design system.
- **Display:** Name, Image (if available, using a stylized container), Ancestry, Community, Level, Class, and Subclass.
- **Stats:** Remove the old 6 stats from the card view to keep the card clean, or update them to the new 6 stats. Given the instruction "render card view with name, ancestry, community, level, class, subclass and image", we will focus on those and remove the stats grid from the main card view.
- **Interaction:** Clicking the card should navigate to the detail view. We will wrap the card in a Next.js `<Link>`.

### Detail View (`app/players/[id]/page.tsx`)
Create a new dynamic route for the player detail view.
- Follow the "Living Chronicle" design system (`DESIGN.md`): use `surface-container` nesting, no sharp corners, no pure black.
- **Header:** Large image, Name, Level, Tier, Ancestry, Community, Class, Subclass.
- **Stats:** Display the 6 Daggerheart stats (Agility, Strength, Finesse, Instinct, Presence, Knowledge) using the "Ledger Style" or chips.
- **Narrative Sections:** Display the `description`.
- **Questions:** Display `backgroundQuestions` and `connectionQuestions` clearly, perhaps using the "Quest Scroll" specialized container pattern for answers to give it a narrative feel.

## Architecture & Files
1. Create `app/types.ts` (or similar) to export the `Player` interface.
2. Update `app/players/data.json` to match the new schema with mock data for Kaelen and Thrain.
3. Update `app/players/page.tsx` to use the new schema, render the requested fields, and add `<Link>` tags.
4. Create `app/players/[id]/page.tsx` to handle the detail view.

## Next Steps
1. User reviews this spec.
2. If approved, generate the implementation plan (using `writing-plans`).