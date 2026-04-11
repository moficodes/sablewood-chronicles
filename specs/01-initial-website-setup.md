# Implementation Plan: Sablewood Chronicles

## 1. Project Setup
- Update `next.config.ts` to include `output: "export"` for static export.
- Install `lucide-react` for icons and `next-themes` for handling dark/light mode switching.

## 2. Design System & Styling (Tailwind v4)
- **Typography**: Replace Geist font with "Plus Jakarta Sans" via `next/font/google` in `app/layout.tsx`.
- **Colors**: Map the colors from `DESIGN.md` into CSS variables in `app/globals.css` under `:root` for light mode and `.dark` for dark mode.
  - Light mode base colors (Parchment aesthetic):
    - `surface`: `#fff8f0`
    - `surface-dim`: `#f0d991`
    - `surface-container-lowest`: `#ffffff`
    - `surface-container-low`: `#fff3d5`
    - `surface-container`: `#ffedba`
    - `surface-container-high`: `#fbf2cd` (derived)
    - `surface-container-highest`: `#f7e1a0`
    - `primary`: `#8d34b4`
    - `primary-container`: `#e8aaff`
    - `primary-dim`: `#8025a6`
    - `on-surface`: `#3e3101`
    - `outline-variant`: `#c4b174`
    - `secondary`: `#954b00`
    - `secondary-container`: `#ffdcc5`
    - `on-secondary-container`: `#814000`
    - `tertiary`: `#2d6a4f`
    - `tertiary-container`: `#beffdc`
  - Dark mode base colors: Adjust the above colors to darker, more saturated variations (e.g. dark sepia, deep purples) to retain the "Living Chronicle" feel while inverting light.
- **Components**: Adhere strictly to the "No-Line" rule (no 1px borders, use `outline-variant` at 15% opacity if needed), utilize overlapping tonal shifts, and apply `rounded-2xl` minimum corner radius.

## 3. Layout & Navigation
- Create a global `Navbar` component.
  - Include navigation links: Home (`/`), Players (`/players`), NPCs (`/npcs`), Locations (`/locations`).
  - Add a Theme Toggle button (Sun/Moon icon).
  - Implement a mobile-responsive design (hamburger menu on smaller screens, standard inline links on larger screens).
- Wrap `children` in `app/layout.tsx` with a `ThemeProvider` (from `next-themes`).

## 4. Data Layer
- Create static data files:
  - `app/players/data.json` (Array of Player Characters with stats, class, race, etc.)
  - `app/npcs/data.json` (Array of NPCs with name, role, brief description, etc.)
  - `app/locations/data.json` (Array of Locations with name, region, description, etc.)

## 5. Pages Construction
- **Home Page** (`app/page.tsx`): Welcome section with campaign details utilizing "Quest Scroll" asymmetrical container.
- **Players Page** (`app/players/page.tsx`): Render list of PC cards using `surface-container-lowest` on a `surface-container-low` background.
- **NPCs Page** (`app/npcs/page.tsx`): Render list of NPC cards.
- **Locations Page** (`app/locations/page.tsx`): Render list of Location cards.

## 6. Build and Verification
- Run `bun run build` to ensure static export completes without errors.
- Run `bun run lint` to ensure no linting issues.
