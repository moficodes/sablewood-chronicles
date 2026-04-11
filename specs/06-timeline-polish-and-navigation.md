# Timeline Polish and Navigation Updates

## Overview
This spec outlines UI improvements for the new Timeline page and adds global navigation links to improve discoverability.

## 1. Collapsible Filter Card
The filter UI on `/timeline` currently takes up too much vertical space. 
- **Implementation:** Introduce a boolean React state (`isFiltersOpen`, default `false`).
- **Trigger:** A toggle button styled according to `DESIGN.md` (e.g., a secondary surface container button with a "Filters" label and a chevron icon indicating state).
- **Behavior:** When collapsed, only the toggle button is visible. When expanded, the full array of filter chips (Type, Arc, PC) is displayed.

## 2. Global Navigation Link
Add a link to the timeline from the site's main navigation bar.
- **File:** (Likely `components/Header.tsx`, `components/Navbar.tsx` or `app/layout.tsx` depending on current project structure).
- **Label:** "Timeline" or "Chronicles".
- **Destination:** `/timeline`

## 3. Homepage Integration
Add a prominent link or section on the homepage (`app/page.tsx`) directing users to the timeline.
- **Implementation:** A new card or section near the top or middle of the homepage.
- **Content:** Title (e.g., "The Chronicles"), brief description (e.g., "Explore the events, battles, and discoveries of Sablewood."), and a Call-to-Action button linking to `/timeline`.