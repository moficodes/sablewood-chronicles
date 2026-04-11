# Feature Specification: TTRPG Campaign Wiki Static Site

**Feature Branch**: `001-ttrpg-wiki`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "Build a static web site for a ttrpg game notes and wiki..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Home Page & Core Navigation (Priority: P1)

Users visit the website to quickly understand the current state of the campaign, viewing high-level campaign information and current party activities.

**Why this priority**: The home page is the entry point and provides the most critical summary of the campaign. The navigation allows access to all other sections.

**Independent Test**: Can be fully tested by loading the root URL, verifying the campaign info and activities are visible, and checking that the navigation menu links to placeholders or actual pages.

**Acceptance Scenarios**:

1. **Given** a user navigates to the root URL, **When** the page loads, **Then** they see the high-level campaign information and current party activities.
2. **Given** a user is on any page, **When** they look at the navigation menu, **Then** they see links to Home, Players, NPCs, Locations, and Timeline.

---

### User Story 2 - Player Characters (PCs) Directory (Priority: P2)

Users want to browse the list of Player Characters and view detailed information for each character to understand the party composition and individual backgrounds.

**Why this priority**: Characters are central to the game. Having easy access to PC stats, portraits, backgrounds, and connections is essential during play and between sessions.

**Independent Test**: Can be tested by navigating to the Players index page to see the list, and clicking a player to view their specific details page.

**Acceptance Scenarios**:

1. **Given** a user is on the Players page, **When** the page loads, **Then** they see a list of all PCs.
2. **Given** a user is on the Players page, **When** they select a specific PC, **Then** they are taken to a detailed page showing the character's class, portrait, background, and connections.

---

### User Story 3 - NPCs Directory (Priority: P2)

Users need a reference of notable Non-Player Characters encountered in the campaign, including their details and relationships with the players.

**Why this priority**: Keeping track of a growing cast of NPCs is difficult without a dedicated directory.

**Independent Test**: Can be tested by navigating to the NPCs index page to see the list, and clicking an NPC to view their detailed page.

**Acceptance Scenarios**:

1. **Given** a user is on the NPCs page, **When** the page loads, **Then** they see a list of notable NPCs.
2. **Given** a user is on the NPCs page, **When** they select a specific NPC, **Then** they are taken to a detailed page showing the NPC's details and their relationship with the player party.

---

### User Story 4 - Locations Directory (Priority: P3)

Users want to explore the world map and locations visited, referencing specific location details.

**Why this priority**: World-building and geography are important context, but generally referenced slightly less frequently than characters during a session.

**Independent Test**: Can be tested by navigating to the Locations index page to see the list, and clicking a location to view its detail page.

**Acceptance Scenarios**:

1. **Given** a user is on the Locations page, **When** the page loads, **Then** they see a list of explored or known locations.
2. **Given** a user is on the Locations page, **When** they select a specific Location, **Then** they are taken to a detailed page containing specific information about that location.

---

### User Story 5 - Campaign Timeline (Priority: P3)

Users want to review the chronological sequence of events that have happened in the campaign so far.

**Why this priority**: The timeline provides historical context and helps players remember past sessions.

**Independent Test**: Can be tested by navigating to the Timeline page and verifying that events are listed in chronological order.

**Acceptance Scenarios**:

1. **Given** a user is on the Timeline page, **When** the page loads, **Then** they see a list of campaign events ordered chronologically.

---

### User Story 6 - Dark Mode Toggle and Responsive Design (Priority: P1)

Users want to switch between light and dark themes to accommodate different lighting environments (like a dimly lit game room), and access the wiki comfortably on mobile devices.

**Why this priority**: A core usability requirement for a digital tool used during tabletop games, which often have varied lighting. Mobile accessibility is crucial for players checking notes at the table.

**Independent Test**: Can be tested by clicking the theme toggle button and observing color changes according to the design system, and by resizing the browser window to mobile width.

**Acceptance Scenarios**:

1. **Given** a user is viewing any page, **When** they click the dark mode toggle button, **Then** the UI theme switches from light to dark (or vice-versa), persisting the choice or applying immediately.
2. **Given** a user views the site on a mobile device or narrow viewport, **When** the page renders, **Then** the layout adjusts appropriately (e.g., stacked cards, mobile-friendly navigation).

### Edge Cases

- What happens when a PC has no connections or a missing portrait? (Should display a default placeholder or hide the section gracefully).
- How does the system handle an NPC with no known relationship to the players?
- What happens when a timeline event lacks a specific date but falls within an era?
- How does the static site generation handle empty directories (e.g., if there are no locations yet)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Home page displaying high-level campaign information and current party activities.
- **FR-002**: System MUST provide a Players list page and individual PC detail pages showing class, portrait, background, and connections.
- **FR-003**: System MUST provide an NPCs list page and individual NPC detail pages showing general details and relationships with the players.
- **FR-004**: System MUST provide a Locations list page and individual Location detail pages.
- **FR-005**: System MUST provide a Timeline page displaying events chronologically.
- **FR-006**: System MUST include a global toggle button that switches the application theme between light and dark modes.
- **FR-007**: System MUST be responsive, providing an optimal viewing experience across mobile, tablet, and desktop devices.
- **FR-008**: System MUST be built and exported as a static website compatible with GitHub Pages hosting.
- **FR-009**: System MUST use Tailwind CSS for styling and strictly adhere to the visual guidelines defined in the "Living Chronicle" Design System (no 1px borders, specific color palette usage, organic layering, specific typography scale).
- **FR-010**: System MUST manage data source via JSON data files.

### Key Entities

- **Player Character (PC)**: Represents a player's avatar. Attributes: Name, Class, Portrait (Image URL), Background (Text), Connections (List of relationships).
- **Non-Player Character (NPC)**: Represents game characters controlled by the Game Master. Attributes: Name, Details/Lore, Relationship with Players (Text).
- **Location**: Represents a place in the game world. Attributes: Name, Description, Associated Entities (optional).
- **Timeline Event**: Represents an event in the campaign history. Attributes: Date/Order, Title, Description.
- **Campaign**: High-level metadata. Attributes: Title, Description, Current Activities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The generated static site bundle can be successfully served from any static file host without requiring a server-side runtime.
- **SC-002**: Users can navigate between all main sections (Home, Players, NPCs, Locations, Timeline) with no broken links.
- **SC-003**: The dark mode toggle successfully switches the UI theme and affects all pages.
- **SC-004**: The UI layout remains readable and navigable on viewport widths down to 320px (mobile phones).
- **SC-005**: Visual design passes an audit against the constraints provided (e.g., 0 instances of 1px solid borders, 0 instances of pure black `#000000`).

## Assumptions

- Data (PCs, NPCs, Locations, Timeline) will initially be static mock data or simple structured files that are compiled during the build step.
- We will be using Next.js App Router static export (`output: 'export'`) as the mechanism for generating the GitHub pages compatible static site, per standard modern Next.js static site generation.
- The "Living Chronicle" Design System dictates the theme tokens, which means the dark mode implementation will map the default palette tokens to darker alternatives not explicitly defined in DESIGN.md, or inverse them appropriately while maintaining the design system's aesthetic intent.
