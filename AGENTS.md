<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context: Sablewood Chronicles

## Tooling & Commands
- **Package Manager**: Use `bun` exclusively (e.g., `bun install`, `bun dev`, `bun run lint`). Do not use `npm`, `yarn`, or `pnpm`.
- **Framework & Styling**: Next.js App Router + React 19 + Tailwind CSS v4 (`@tailwindcss/postcss`).

## Design System Constraints (CRITICAL)
For any UI, component, or layout work, you MUST follow the aesthetic rules defined in `DESIGN.md` ("The Living Chronicle"). 
- **No Borders or Dividers**: 1px lines are strictly forbidden. Create boundaries using background color tonal shifts (e.g., `surface` to `surface-container-low`) or whitespace.
- **No Pure Black**: Never use `#000000`. Use the designated `on-surface` color (e.g., `#3e3101`) for high-legibility text and icons.
- **No Sharp Corners**: Do not use `rounded-none`. The minimum border radius is `1rem`.
- **Material Depth**: Create physical depth using overlapping elements, glassmorphism (`backdrop-blur`), and specific hex values provided in `DESIGN.md` rather than flat SaaS layouts.

## Active Technologies
- TypeScript / React 19 / Node.js 20+ + Next.js App Router, Tailwind CSS v4 (@tailwindcss/postcss)
