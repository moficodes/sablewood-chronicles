# Campaign TUI CLI Design

## Overview
A terminal-based user interface (TUI) application built with React and Ink to manage the `data/campaign.yml` file. This CLI will live inside the existing monorepo, keeping everything in the TypeScript/Bun ecosystem, and will provide an easy-to-use dashboard for viewing and editing campaign data safely.

## Architecture & Data Flow
- **Location:** The CLI will be located in `tools/campaign-manager/` (or a similar top-level directory to keep it distinct from the Next.js `app` directory).
- **Tooling:** Built using Bun, TypeScript, and the `ink` React library for rendering the terminal UI.
- **Data Parsing:** Reads the `data/campaign.yml` file using `js-yaml` to parse it into strongly typed in-memory React state.
- **Validation:** Uses `zod` to enforce a strict schema, matching the data structure required by the Next.js application, preventing corrupted or invalid data from breaking the website.
- **Data Flow:** All edits, wizard workflows, and updates modify the in-memory React state. When the user explicitly saves, the state is serialized back to YAML and written to the file system.

## Layout & Components
The Ink application will use a structured layout to emulate a real dashboard:

- **Header:** Displays global campaign information, such as the active quest name and the date of the next session.
- **Two-Pane UI:**
  - **Left Sidebar (Navigation):** A menu to select the active view, containing sections like `Players`, `NPCs`, `Locations`, and `Timeline`.
  - **Right Main Pane (Content):** The active view based on the sidebar selection. It will display a searchable, paginated list of the selected entity type (e.g., all NPCs, Timeline events).
- **Footer/Hotkeys:** A persistent footer indicating available global hotkeys (e.g., `[tab]` to switch panes, `[w]` to open the Add Wizard, `[q]` to quit, `[ctrl+s]` to save).
- **Wizards:** When adding or extensively editing an entity, the two-pane view is temporarily replaced by an interactive form. It will use `ink-text-input`, `ink-select-input`, or similar components to guide the user step-by-step through required fields.

## Safety & Error Handling
- **Auto-backups:** Before any write operation to `campaign.yml`, the application will automatically create a backup file (e.g., `data/campaign.yml.bak`). This ensures that accidental data loss is completely mitigated.
- **Validation Errors:** If an edit or new entry fails the `zod` schema validation (e.g., missing an ID or incorrect data type), the UI will immediately display a clear error message and prevent the save operation until the issue is resolved.
- **Graceful Exits:** Catching `ctrl+c` to warn users if they have unsaved changes before exiting the CLI.
