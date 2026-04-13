# Campaign TUI CLI - Nested Form Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the CLI's `Wizard` to support dynamic, recursive steps for arrays and nested objects.

**Architecture:** We will update `WizardStep` to include a `type` property. We will rewrite the Wizard's execution flow from a simple linear index to a dynamic execution queue (stack) using string paths (e.g. `stats.agility`). We will use `lodash.set` to mutate the deep draft object.

**Tech Stack:** React, Ink, ink-text-input, lodash.set, lodash.get

---

### Task 1: Add Dependencies and Update Schema

**Files:**
- Modify: `package.json`
- Modify: `cli/Wizard.tsx`

- [ ] **Step 1: Install lodash utilities**

```bash
bun add lodash.set lodash.get
bun add -d @types/lodash.set @types/lodash.get
```

- [ ] **Step 2: Expand WizardStep interface**

Modify `WizardStep` in `cli/Wizard.tsx`:

```tsx
// At the top of cli/Wizard.tsx
import set from 'lodash.set';
import get from 'lodash.get';

export interface WizardStep {
  key: string;
  prompt: string;
  type?: 'text' | 'object' | 'array';
  substeps?: WizardStep[];
  validate?: (val: string) => boolean | string;
}

// Helper type for the execution queue
export interface QueuedStep {
  path: string; // The deep path in the object, e.g. "stats.agility" or "connectionQuestions[0].question"
  step: WizardStep;
  isArrayPrompt?: boolean; // True if this is the "Add item? y/n" prompt
  arrayPath?: string; // The path of the array being modified
  arrayIndex?: number; // The current index being appended
}
```

- [ ] **Step 3: Verify file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock cli/Wizard.tsx
git commit -m "feat(cli): add lodash and expand wizard schema for nested data"
```

### Task 2: Implement Dynamic Queue in Wizard

**Files:**
- Modify: `cli/Wizard.tsx`

- [ ] **Step 1: Rewrite Wizard state and initialization**

Replace the internals of the `Wizard` component in `cli/Wizard.tsx`:

```tsx
export function Wizard<T extends Record<string, unknown>>({ 
  steps, 
  initialData, 
  onSubmit, 
  onCancel 
}: WizardProps<T>) {
  const initData = initialData || {} as Partial<T>;
  const [draftData, setDraftData] = useState<Partial<T>>({ ...initData });
  const [error, setError] = useState<string | null>(null);

  // Initialize the queue with the root steps
  const [queue, setQueue] = useState<QueuedStep[]>(() => {
    return steps.map(s => ({ path: s.key, step: s }));
  });

  const currentQStep = queue[0];
  const isArrayPrompt = currentQStep?.isArrayPrompt;

  const [currentInput, setCurrentInput] = useState(() => {
    if (!currentQStep) return "";
    if (currentQStep.isArrayPrompt) return ""; // y/n prompt starts empty
    const val = get(initData, currentQStep.path);
    return val !== undefined ? String(val) : "";
  });

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
  });

  const handleSubmit = (value: string) => {
    if (!currentQStep) return;

    if (isArrayPrompt) {
      const isYes = value.toLowerCase() === 'y' || value.toLowerCase() === 'yes';
      if (isYes) {
        // They want to add an item. 
        // 1. Queue the substeps with the current index
        // 2. Re-queue the array prompt itself afterward for the NEXT index.
        const substeps = currentQStep.step.substeps || [];
        const nextIndex = currentQStep.arrayIndex! + 1;
        
        const unrolledSteps: QueuedStep[] = substeps.map(sub => ({
          path: `${currentQStep.arrayPath}[${currentQStep.arrayIndex}].${sub.key}`,
          step: sub
        }));

        const rePrompt: QueuedStep = {
          ...currentQStep,
          arrayIndex: nextIndex
        };

        const newQueue = [...unrolledSteps, rePrompt, ...queue.slice(1)];
        advanceQueue(newQueue, draftData);
      } else {
        // They are done with the array. Just drop the prompt and move on.
        advanceQueue(queue.slice(1), draftData);
      }
      return;
    }

    // Normal text validation
    if (currentQStep.step.validate) {
      const validationResult = currentQStep.step.validate(value);
      if (validationResult === false) {
        setError("Invalid input.");
        return;
      }
      if (typeof validationResult === "string") {
        setError(validationResult);
        return;
      }
    }
    
    setError(null);

    // Deep merge using lodash.set
    const updatedDraft = { ...draftData } as Partial<T>;
    // If it's empty string, we can either set it or ignore it. Let's set it.
    set(updatedDraft as object, currentQStep.path, value);
    setDraftData(updatedDraft);

    // Expand objects dynamically or just pop the queue
    let newQueue = queue.slice(1);
    if (currentQStep.step.type === 'object' && currentQStep.step.substeps) {
      const subQueue: QueuedStep[] = currentQStep.step.substeps.map(sub => ({
        path: `${currentQStep.path}.${sub.key}`,
        step: sub
      }));
      newQueue = [...subQueue, ...newQueue];
    } else if (currentQStep.step.type === 'array' && currentQStep.step.substeps) {
      // First time hitting an array. Insert the array prompt.
      // Pre-calculate current length if data exists
      const existingArray = get(updatedDraft, currentQStep.path) as any[];
      const startIndex = existingArray && Array.isArray(existingArray) ? existingArray.length : 0;
      
      const arrayPrompt: QueuedStep = {
        path: currentQStep.path, // Doesn't matter
        step: currentQStep.step,
        isArrayPrompt: true,
        arrayPath: currentQStep.path,
        arrayIndex: startIndex
      };
      
      // We don't save a value for the array root itself right now, we just swap to the prompt
      newQueue = [arrayPrompt, ...newQueue];
    }

    advanceQueue(newQueue, updatedDraft);
  };

  const advanceQueue = (nextQueue: QueuedStep[], updatedDraft: Partial<T>) => {
    if (nextQueue.length === 0) {
      onSubmit(updatedDraft as T);
    } else {
      setQueue(nextQueue);
      const nextItem = nextQueue[0];
      if (nextItem.isArrayPrompt) {
        setCurrentInput("");
      } else {
        const nextVal = get(updatedDraft, nextItem.path);
        setCurrentInput(nextVal !== undefined ? String(nextVal) : "");
      }
    }
  };

  if (!currentQStep) return <Text>Loading...</Text>;

  const displayPrompt = isArrayPrompt 
    ? `Add an item to ${currentQStep.step.prompt}? (y/n):`
    : currentQStep.step.prompt;

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">Wizard Editor</Text>
      <Box marginTop={1}>
        <Text color="green">{displayPrompt} </Text>
        <TextInput 
          value={currentInput} 
          onChange={(val) => {
            setCurrentInput(val);
            setError(null);
          }} 
          onSubmit={handleSubmit}
        />
      </Box>
      {error && (
        <Box marginTop={1}>
          <Text color="red">{error}</Text>
        </Box>
      )}
      <Box marginTop={1}>
        <Text color="gray">[Enter] Submit | [Esc] Cancel</Text>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add cli/Wizard.tsx
git commit -m "feat(cli): refactor wizard to support nested object and array prompts via execution queue"
```

### Task 3: Map the new Step Definitions

**Files:**
- Modify: `cli/App.tsx`

- [ ] **Step 1: Update App.tsx Wizard Constants**

Replace the simple step arrays with the fully nested versions:

```tsx
const QUESTION_SUBSTEPS: WizardStep[] = [
  { key: "question", prompt: "Question:" },
  { key: "answer", prompt: "Answer:" }
];

const INTERACTION_SUBSTEPS: WizardStep[] = [
  { key: "description", prompt: "Description:" },
  { key: "highlight", prompt: "Highlight (optional):" }
];

const PLAYER_WIZARD_STEPS: WizardStep[] = [
  { key: "name", prompt: "Name:" },
  { key: "ancestry", prompt: "Ancestry:" },
  { key: "class", prompt: "Class:" },
  { key: "subclass", prompt: "Subclass:" },
  { key: "level", prompt: "Level (number):" },
  { key: "description", prompt: "Description:" },
  { key: "backstory", prompt: "Backstory:" },
  { 
    key: "stats", prompt: "Stats", type: "object", substeps: [
      { key: "agility", prompt: "Agility:" },
      { key: "strength", prompt: "Strength:" },
      { key: "finesse", prompt: "Finesse:" },
      { key: "instinct", prompt: "Instinct:" },
      { key: "presence", prompt: "Presence:" },
      { key: "knowledge", prompt: "Knowledge:" }
    ]
  },
  { key: "backgroundQuestions", prompt: "Background Questions", type: "array", substeps: QUESTION_SUBSTEPS },
  { key: "connectionQuestions", prompt: "Connection Questions", type: "array", substeps: QUESTION_SUBSTEPS }
];

const NPC_WIZARD_STEPS: WizardStep[] = [
  { key: "name", prompt: "Name:" },
  { key: "role", prompt: "Role:" },
  { key: "location", prompt: "Location:" },
  { key: "attitudeTowardParty", prompt: "Attitude:" },
  { key: "description", prompt: "Description:" },
  { key: "memorableInteractions", prompt: "Memorable Interactions", type: "array", substeps: INTERACTION_SUBSTEPS }
];

const LOCATION_WIZARD_STEPS: WizardStep[] = [
  { key: "name", prompt: "Name:" },
  { key: "region", prompt: "Region:" },
  { key: "description", prompt: "Description:" },
  { key: "memorableInteractions", prompt: "Memorable Interactions", type: "array", substeps: INTERACTION_SUBSTEPS }
];

const TIMELINE_WIZARD_STEPS: WizardStep[] = [
  { key: "title", prompt: "Title:" },
  { key: "type", prompt: "Type (e.g. combat, npc_meet):" },
  { key: "description", prompt: "Description:" },
  {
    key: "time", prompt: "Time", type: "object", substeps: [
      { key: "era", prompt: "Era (e.g. The Second Age):" },
      { key: "year", prompt: "Year:" },
      { key: "month", prompt: "Month:" },
      { key: "day", prompt: "Day:" }
    ]
  },
  { key: "pcNotes", prompt: "PC Notes", type: "array", substeps: [
    { key: "pcId", prompt: "PC ID (e.g. p1):" },
    { key: "note", prompt: "Note:" }
  ]}
];
```

- [ ] **Step 2: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add cli/App.tsx
git commit -m "feat(cli): map nested array and object steps to all wizard forms"
```