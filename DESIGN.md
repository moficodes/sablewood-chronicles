# Design System Document

## 1. Overview & Creative North Star: "The Living Chronicle"
This design system rejects the clinical, "flat" aesthetic of modern SaaS platforms in favor of **The Living Chronicle**. Our North Star is the feeling of a digital scrapbook—a tactile, high-end record of an epic quest. We move beyond standard grids to embrace **intentional asymmetry** and **organic layering**. 

The interface should feel as though it was hand-assembled by a master cartographer. We achieve this through "The Stack"—overlapping surfaces, non-traditional typography scales, and a vibrant color palette that balances the arcane (purples), the adventurous (oranges), and the natural (greens). This is not a "grimdark" dungeon crawler; it is a celebration of the journey.

---

## 2. Colors: The Alchemist’s Palette
Our palette is rooted in a warm, parchment-like base (`surface: #fff8f0`) to provide a friendly, accessible foundation. 

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. They represent a "default" thinking that breaks the immersive quality of the system. Boundaries must be defined through **Background Color Shifts**. For example, a side-navigation menu should sit on `surface-container-low`, while the main content area uses `surface`. 

### Surface Hierarchy & Nesting
Treat the UI as physical layers of vellum and enchanted glass. 
*   **Deep Backgrounds:** Use `surface-dim` (#f0d991) for the furthest background layers.
*   **Active Layers:** Use `surface-container` (#ffedba) to `surface-container-highest` (#f7e1a0) to pull elements closer to the user.
*   **Glass & Gradient Rule:** For elements that require high prominence (like modals or "floating" dice rollers), utilize **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` (16px–32px). 

### Signature Textures
To add "soul," never use flat colors for large CTAs. Use a subtle linear gradient transitioning from `primary` (#8d34b4) to `primary-container` (#e8aaff) at a 135-degree angle. This creates a sense of magical energy and depth that static fills cannot replicate.

---

## 3. Typography: Editorial Voice
We utilize **Plus Jakarta Sans** across all levels, but we manipulate its weight and scale to provide a "friendly yet authoritative" editorial feel.

*   **Display Scale (`display-lg` to `display-sm`):** These are your "Chapter Headings." Use them with tight letter-spacing (-0.02em) to create a bold, modern impact.
*   **Title & Headline Scale:** These represent "Scroll Headers." They should always be in `on-surface` (#3e3101) to maintain high legibility against the warm background.
*   **Body Text:** Use `body-lg` for general narrative and `body-md` for stats. The generous x-height of our typeface ensures that even complex TTRPG rules remain readable during a heated encounter.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a result of light and material, not artificial strokes.

*   **The Layering Principle:** Rather than using a border to separate a character card from the background, place the card (using `surface-container-lowest`: #ffffff) onto a section utilizing `surface-container-low` (#fff3d5). The 2% shift in tonal value is enough to define the object while maintaining a premium, "soft" feel.
*   **Ambient Shadows:** For floating elements (like a d20 dice menu), use extra-diffused shadows. 
    *   *Blur:* 40px–60px.
    *   *Opacity:* 6%–8%.
    *   *Color:* Use a tinted version of `on-surface` (#3e3101) instead of pure black to keep the lighting natural.
*   **The "Ghost Border" Fallback:** If a layout requires a boundary for accessibility, use the `outline-variant` (#c4b174) token at **15% opacity**. This creates a "suggestion" of a line that feels like a faint pencil mark on parchment.

---

## 5. Components: Hand-Crafted Primitives

### Buttons
*   **Primary:** A vibrant gradient from `primary` (#8d34b4) to `primary-dim` (#8025a6). Use `rounded-xl` (3rem) to give them a friendly, tactile feel.
*   **Secondary:** Use the `secondary-container` (#ffdcc5) with `on-secondary-container` text (#814000). No border.
*   **States:** On hover, increase the surface elevation by shifting from `primary` to `primary-fixed-dim`.

### Input Fields & Text Areas
*   **Styling:** Inputs should use `surface-container-lowest` (#ffffff). Instead of a heavy border, use a 2px bottom-accent of `primary` when focused.
*   **Roundedness:** Use the `md` scale (1.5rem) to maintain the "playful" geometry.

### Chips (Tags/Spells)
*   Selection chips should utilize `tertiary-container` (#beffdc) for a "nature/healing" feel. 
*   Shape: `full` (9999px) to contrast against the more rectangular "paper" sheets of the main UI.

### Cards & Lists (The Ledger Style)
*   **Rule:** Forbid all divider lines.
*   **Implementation:** Separate list items by alternating between `surface` and `surface-container-low`. Use the Spacing Scale (2rem) between cards to allow the background parchment to "breathe."

### Unique Component: The "Quest Scroll" (Custom Container)
A specialized container using `surface-variant` (#f7e1a0) with an asymmetrical `rounded-lg` (2rem) on the top-left and bottom-right corners, creating a hand-cut paper effect.

---

## 6. Do's and Don'ts

### Do:
*   **Overlap Elements:** Let an icon of a map scroll "break the container" and overlap two different surface colors. This creates the "digital scrapbook" depth.
*   **Use Tonal Shifts:** Use `surface-container-high` for "nested" content like inventory slots within a character sheet.
*   **Embrace Color:** Use `secondary` (#954b00) for "Action" items and `tertiary` (#2d6a4f) for "Information/Lore" items.

### Don't:
*   **Don't use 100% Black:** Never use `#000000`. Use `on-surface` (#3e3101) for all text and iconography to maintain the warm, organic feel.
*   **Don't use Sharp Corners:** Avoid `rounded-none`. The world of adventure is organic; use `DEFAULT` (1rem) as your absolute minimum roundedness.
*   **Don't use Dividers:** If you feel the need to add a line, add 16px of whitespace instead. If that fails, shift the background color.


