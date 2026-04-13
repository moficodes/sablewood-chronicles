# Homepage Empty Players Design

## Overview
When the campaign has no players configured (the `players` list is empty), the homepage's player list section will display a cheeky "Wanted" poster instead of an empty space or a broken carousel.

## Design

### Visuals
The empty state will mimic the "Notice Board" style seen further down the homepage:
- **Background**: Parchment/off-white tone (`#f4ebd8`).
- **Layout**: Centered within the `surface-container-low` section, slightly rotated (`rotate-2`) with a shadow to appear like a physical paper.
- **Accents**: A dark "pin" at the top center.
- **Typography**: Uses `Shadows_Into_Light` for the main heading and `Kalam` for the body text (similar to the Notice Board fonts).

### Copy
- **Header**: "WANTED: HEROES" (in a bold, dark red color to stand out).
- **Subtext**: "The tavern is quiet. Too quiet. Inquire within... survival not guaranteed."

### Implementation Details
- In `app/components/player-list.tsx`, we will add an early return or conditional rendering block at the top of the component or inside the main `<section>`.
- If `players.length === 0`, render the Wanted poster.
- Since `player-list.tsx` is a Client Component, we will import the `Shadows_Into_Light` and `Kalam` fonts from `next/font/google` directly inside the file so they can be applied to the poster text.
