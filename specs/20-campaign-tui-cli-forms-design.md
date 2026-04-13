# Campaign TUI CLI - Form System & Data Mutation Design

## Overview
This design covers building a robust form system and workflow for editing and creating items within the Ink TUI. It involves expanding the state machine, creating a scalable `Wizard` component, and connecting those interactions directly to the file system.

## State Architecture Updates
We will add an `EDIT` state to `App.tsx`:
- `EDIT`: Invoked by pressing `[e]` when the `appState` is `detail`, or `[c]` when the `appState` is `nav` or `list`.
- When in `EDIT` mode, the entire right pane (or potentially the whole screen) transitions into the Form view.
- A `Wizard` component drives the experience.

## The Form Wizard Component
Because terminal inputs can only capture one line of focus at a time (generally), we will use a "Step-by-Step" guided wizard approach (e.g. like `@inquirer/prompts`).
- **Inputs:** We will rely heavily on `ink-text-input` for string values.
- **Workflow:** 
  1. The Wizard receives an array of `Step` objects.
  2. A step defines a `key` (e.g. `name`), a `prompt` (e.g. "What is the player's name?"), and an `initialValue`.
  3. The Wizard displays the `prompt` and an active text input.
  4. The user types and hits `[Enter]`.
  5. The Wizard saves the input to an internal `draft` object, and moves to the next `Step`.
  6. Upon completing the final step, it calls an `onSubmit(draft)` callback.

## Saving the Data
When `onSubmit` fires in `App.tsx`:
- For an edit: The CLI replaces the existing entity object within the relevant array in the `Campaign` state object.
- For a create: The CLI pushes the new object to the array.
- The `writeCampaign(data)` utility function is called, safely persisting the changes (with a backup) back to `data/campaign.yml`.
- The CLI returns the user to the `DETAIL` or `LIST` view to see their changes instantly.

## Scope
For this specific implementation, we will focus entirely on scaffolding the generic Wizard engine, hooking up the save/mutate logic in `App.tsx`, and building out the exact wizard steps for **Players** and **NPCs**. We will exclude deeply nested optional arrays (like `backgroundQuestions` and `memorableInteractions`) in this initial pass to establish the baseline mutation pattern successfully, adding those as a follow-up feature.