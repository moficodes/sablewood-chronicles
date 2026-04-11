# 04 Location Images and Details Page Design

## 1. Overview
This specification outlines the updates to the "Locations" feature of the Sablewood Chronicles website. It involves expanding the static location data to support multiple images and memorable PC interactions, updating the Locations list page to feature cover images, and creating a new dynamic Location Details page (`/locations/[id]`).

## 2. Data Structure (`app/locations/data.json`)
The existing JSON structure will be enhanced. We are keeping all data nested within the single `data.json` file for simplicity and cohesion.

**Added Fields per Location:**
*   `images`: (Optional) Array of strings. Can be local paths (e.g., `/locations/oakhaven-1.jpg`) or external URLs.
*   `interactions`: (Optional) Array of objects representing memorable events at this location.
    *   `description`: String detailing the event.
    *   `highlight`: String highlighting a specific cool moment or outcome.
    *   `pcsInvolved`: Array of strings (PC IDs or names) involved in the interaction.

**Example Data Shape:**
```json
{
  "id": "l1",
  "name": "Oakhaven",
  "region": "The Green Valley",
  "description": "A peaceful village...",
  "images": [
    "/locations/oakhaven-1.jpg",
    "https://example.com/oakhaven-2.jpg"
  ],
  "interactions": [
    {
      "description": "Defended the town from goblins.",
      "highlight": "Epic final blow by the Paladin",
      "pcsInvolved": ["pc1", "pc3"]
    }
  ]
}
```

## 3. UI/UX Changes

### 3.1 Locations List Page (`app/locations/page.tsx`)
*   **Feature Image**: The location cards will be updated to display the first image from the `images` array at the top of the card.
*   **Image Fallback**: If `images` is missing or empty, a stylized placeholder reflecting the design system (e.g., a muted icon on a `surface-container-high` background) will be rendered.
*   **Navigation**: The cards will be made clickable, linking to `/locations/[id]`.

### 3.2 Location Details Page (`app/locations/[id]/page.tsx`)
A new dynamic route will be created to display full location details using a "Hero + Grid" layout.

*   **Hero Section & Inline Carousel**:
    *   Occupies the top of the page.
    *   If a location has one image, it's displayed statically.
    *   If a location has multiple images, it functions as an inline carousel with simple Next/Prev arrows overlaid.
    *   Adheres strictly to the `DESIGN.md` "Material Depth" rule: edges must fade or blend into the background (e.g., using `surface-container-lowest` gradients or blurring) rather than hard box borders.
*   **Header Info**: Displays the Location Name (`tertiary` text) and Region (`outline-variant` text) prominently below the hero.
*   **Details Cards**: The core description will sit inside standard design system cards (`surface-container-low` background with the pseudo-shadow `-z-10` layer).
*   **Memorable Interactions**:
    *   Rendered as a section below the main details.
    *   Displays a responsive grid of smaller cards.
    *   Each card highlights the `description`, the specific `highlight`, and the `pcsInvolved`.

## 4. Design System Constraints
All implementations MUST strictly adhere to `DESIGN.md`:
*   **No Borders**: 1px lines are forbidden. Use whitespace and tonal shifts (e.g., `surface` to `surface-container-low`).
*   **No Pure Black**: Use `#3e3101` (`on-surface`) for high legibility.
*   **Radii**: Minimum `1rem` on all container corners. No `rounded-none`.
*   **Depth**: Utilize the `-z-10` overlapping `div` strategy for creating physical depth beneath cards.