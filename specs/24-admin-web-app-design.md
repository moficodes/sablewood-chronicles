# 24 Admin Web App Design

## Overview
A local-only Next.js admin web application to manage the campaign data. This app allows adding, editing, and deleting entities (Players, NPCs, Locations, Timeline events) by directly modifying the `data/campaign.yml` file.

## Architecture & Workspace
- **Workspace Setup**: The repository will be configured as a Bun Workspace. The root `package.json` will include `workspaces: ["admin"]` (leaving the main app at the root or adjusting as needed without breaking existing scripts).
- **Admin App**: A completely separate Next.js App Router project located in the `admin/` directory.
- **Tech Stack**: Next.js (App Router), React 19, Tailwind CSS v4, `js-yaml` for parsing, and potentially `zod` for validation.

## Data Flow
1. **API Routes**: The `admin/` app will have Next.js Route Handlers (e.g., `/api/campaign`) to act as the backend.
2. **Read (GET)**: The API route reads `../data/campaign.yml` using `fs.readFileSync` and parses it with `js-yaml`. It returns the JSON representation to the frontend.
3. **Write (PUT/POST)**: The frontend sends updated JSON back to the API route. The API route dumps it back to YAML using `js-yaml.dump` (configured to preserve block styles for multiline strings like descriptions/backstories) and writes it back using `fs.writeFileSync`.
4. **Validation**: Before saving, the data will be validated against expected TypeScript interfaces to prevent accidental corruption of the YAML structure.

## UI & Forms
- **Visual Style**: Distinct from the main app. It will use a clean, utilitarian, standard admin interface (white backgrounds, standard borders, standard Tailwind colors) rather than the thematic rules in `DESIGN.md`.
- **Layout**: 
  - Sidebar navigation: Home, Players, NPCs, Locations, Timeline.
  - Main content area: Data tables/lists and forms.
- **Forms**:
  - Simple inputs for names, ids, stats.
  - Textareas for longer content (descriptions, backstories).
  - Dynamic field arrays for nested lists (e.g., adding/removing `memorableInteractions` for locations, or `pcNotes` for timeline events).

## Implementation Steps (High Level)
1. Initialize the `admin/` Next.js app and configure the Bun workspace.
2. Build the API routes for reading and writing the YAML file.
3. Create the base layout and navigation.
4. Implement the list and edit views for Home data (next session, quests).
5. Implement the list and edit views for Players.
6. Implement the list and edit views for NPCs.
7. Implement the list and edit views for Locations.
8. Implement the list and edit views for the Timeline.