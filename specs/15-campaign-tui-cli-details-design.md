# Campaign TUI CLI - Interactive Details Design

## Overview
The initial Ink TUI successfully displays campaign data, but the main content pane is currently read-only. We need to upgrade the TUI state machine to support deeper interaction, allowing users to select an item from a list to view its full details.

## State Machine Architecture
We will update the `App.tsx` state to handle nested navigation.

**New App States:**
1. **`NAV`**: The left sidebar has focus. The right pane shows a read-only list of items for the selected category.
2. **`LIST`**: The right pane has focus. The list becomes interactive (using `ink-select-input`). 
3. **`DETAIL`**: The user has selected a specific item. The right pane changes to show the full properties of that single item.
4. **`EDIT`**: (Placeholder for future) The entire screen clears to show a full-screen editing wizard.

**State Variables:**
```tsx
type AppState = "nav" | "list" | "detail" | "edit";
const [appState, setAppState] = useState<AppState>("nav");
const [selectedCategory, setSelectedCategory] = useState("players");
const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
```

## Navigation Paradigm
- **`[Tab]`**: Toggles `appState` between `nav` and `list`.
- **`[Up/Down]`**: 
  - If `nav`: Highlights different categories (Players, NPCs, etc.) and updates `selectedCategory`.
  - If `list`: Highlights different items in the right pane.
- **`[Enter]`**: 
  - If `list`: Sets `selectedEntityId` and changes `appState` to `detail`.
- **`[Esc]`**:
  - If `detail`: Returns to `list`.
  - If `nav` or `list`: Exits the application.

## Component Structure
To keep `App.tsx` manageable, the right-pane views will be extracted:
- `ListView`: Renders the `SelectInput` for the current category array.
- `DetailView`: A switch statement that renders `PlayerDetail`, `NPCDetail`, `LocationDetail`, or `TimelineDetail` based on the category. These components will render formatted text boxes showing all relevant YAML fields (e.g., stats, backstory, memorable interactions).

## Out of Scope
Actual data editing (the `EDIT` state and forms) is out of scope for this specific design step and will be handled in a follow-up task to keep the implementation focused.