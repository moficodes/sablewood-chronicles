# 26 Dynamic AutoForm Design

## Goal
Implement a generic, schema-driven AutoForm component in the `admin/` application to automatically generate form fields for all entity types defined in `types/index.ts`. This form will support primitive types (strings, numbers), nested objects, and arrays. Crucially, it will handle cleaning up empty optional fields before saving.

## Architecture

1. **Schema Definition Layer**:
   A declarative schema system (likely plain TypeScript objects for simplicity) that mirrors the `types/index.ts` structures. Each schema entry defines:
   - `type`: `string`, `number`, `textarea`, `object`, `array`
   - `label`: Display name
   - `optional`: Boolean flag to determine if it should be stripped when empty
   - `fields`: For objects, a nested schema definition.
   - `itemSchema`: For arrays, the schema of a single item.

2. **The AutoForm Component (`<AutoForm schema={schema} data={data} onChange={setData} />`)**:
   A recursive React component that dynamically renders fields based on the provided schema definition.
   - **Primitives**: Renders `<input type="text">` or `<input type="number">` or `<textarea>`.
   - **Objects**: Renders a boxed section and recursively calls `<AutoForm>` on its inner `fields`.
   - **Arrays**: Renders a list of items. Each item has a "Remove" button and recursively calls `<AutoForm>` for the item's fields. Includes an "Add Item" button at the bottom that pushes a new empty item (using `itemSchema` defaults) into the array.

3. **Data Cleanup Utility (`cleanData(obj, schema)`)**:
   Before the `admin` app fires its `PUT` request, the modified data object is passed through a recursive cleanup function.
   - It iterates over the data properties.
   - If a property is empty (`""`, `null`, `undefined`, `[]`, or `{}`) AND the schema marks it as `optional`, the property is entirely removed (`delete obj[key]`) from the object being saved.
   - This ensures the resulting YAML is clean and omits unused optional properties (e.g., `highlight` in `memorableInteractions`, or empty `pcNotes`).

4. **Integration**:
   All existing `[id]/page.tsx` edit pages (Player, NPC, Location, Timeline) will be refactored to simply wrap their data with `<AutoForm schema={PlayerSchema} ... />`.

## Components
- **`AutoForm.tsx`**: The main recursive form renderer.
- **`schemas.ts`**: Contains the exported schema definitions (`PlayerSchema`, `NPCSchema`, `LocationSchema`, `TimelineEventSchema`, `HomeSchema`).
- **`utils.ts`**: Contains the `cleanData` recursive function.