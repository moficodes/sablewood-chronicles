# Campaign TUI CLI - Nested Form Architecture Design

## Overview
This design defines the architecture for expanding the CLI's Form Wizard to handle complex, nested YAML properties (`object` and `array` types). This replaces the basic flat-string input wizard with a dynamic, stateful stack evaluator.

## 1. Wizard Schema Expansion
`WizardStep` will be expanded to support three types:
- **`string` / undefined**: The default behavior. Prompts the user for a single line of text and assigns it to `key`.
- **`object`**: The step provides an array of `substeps`. The wizard allocates an empty object `{}` at `key`, and iteratively prompts the user for each substep, populating the new sub-object before moving on.
- **`array`**: The step provides an array of `substeps`. The wizard first asks a boolean prompt ("Add item? (y/n)"). If `y`, it evaluates the `substeps`, appends the resulting object to an array at `key`, and loops back to the boolean prompt.

## 2. Stateful Stack Execution
To avoid extreme React hook complexity, `Wizard.tsx` will process steps using a flat queue.
- `executionQueue`: An array of pending prompts.
- When an `object` step is reached, its `substeps` are unrolled into the queue with a path prefix (e.g. `stats.agility`).
- When an `array` step is reached, a special `y/n` prompt is queued. If `y`, its `substeps` are unrolled into the queue with an index path (e.g. `backgroundQuestions[0].question`).
- We will likely use a library like `lodash.set` (or a simple recursive assigner) to build the deep `draftData` object from these string paths.

## 3. Data Definitions
We will update `App.tsx` schemas:
- `PLAYER_WIZARD_STEPS` gets `stats`, `backgroundQuestions`, `connectionQuestions`.
- `NPC_WIZARD_STEPS` and `LOCATION_WIZARD_STEPS` get `memorableInteractions`.
- `TIMELINE_WIZARD_STEPS` gets `pcNotes` and an `object` for `time`.

## Exclusions
Strict input masking (e.g. preventing strings in number fields beyond basic parsing) and UI validation forms remain out of scope for this architecture update, relying on the existing optional `.validate()` hook.