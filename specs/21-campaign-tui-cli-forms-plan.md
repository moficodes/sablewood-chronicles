# Campaign TUI CLI - Form System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a step-by-step form wizard for editing and creating base properties of Players and NPCs in the CLI.

**Architecture:** Create a new `Wizard` component that takes an array of step definitions. Modify `App.tsx` to handle `"edit"` and `"create"` app states, load the wizard, and save mutations back via `writeCampaign`.

**Tech Stack:** React, Ink, ink-text-input

---

### Task 1: Create the Wizard Component

**Files:**
- Create: `cli/Wizard.tsx`

- [ ] **Step 1: Implement Wizard Component**

```tsx
// cli/Wizard.tsx
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

export interface WizardStep {
  key: string;
  prompt: string;
}

export interface WizardProps {
  steps: WizardStep[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function Wizard({ steps, initialData = {}, onSubmit, onCancel }: WizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [draftData, setDraftData] = useState<any>({ ...initialData });
  const [currentInput, setCurrentInput] = useState(
    initialData[steps[0]?.key] !== undefined ? String(initialData[steps[0]?.key]) : ""
  );

  const currentStep = steps[currentStepIndex];

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
  });

  const handleSubmit = (value: string) => {
    const updatedDraft = { ...draftData, [currentStep.key]: value };
    setDraftData(updatedDraft);

    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentInput(updatedDraft[nextStep.key] !== undefined ? String(updatedDraft[nextStep.key]) : "");
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onSubmit(updatedDraft);
    }
  };

  if (!currentStep) return <Text>Loading...</Text>;

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">Wizard (Step {currentStepIndex + 1} of {steps.length})</Text>
      <Box marginTop={1}>
        <Text color="green">{currentStep.prompt} </Text>
        <TextInput 
          value={currentInput} 
          onChange={setCurrentInput} 
          onSubmit={handleSubmit}
        />
      </Box>
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
git commit -m "feat(cli): add reusable generic wizard component for forms"
```

### Task 2: Define Wizard Schemas & Integration in App.tsx

**Files:**
- Modify: `cli/App.tsx`

- [ ] **Step 1: Define wizard steps in App.tsx**

Add these configurations to the top of `App.tsx` (below imports):

```tsx
// Inside cli/App.tsx
import { Wizard, type WizardStep } from "./Wizard";
import { writeCampaign } from "./data";

const PLAYER_WIZARD_STEPS: WizardStep[] = [
  { key: "id", prompt: "ID (e.g. p1):" },
  { key: "name", prompt: "Name:" },
  { key: "ancestry", prompt: "Ancestry:" },
  { key: "class", prompt: "Class:" },
  { key: "subclass", prompt: "Subclass:" },
  { key: "level", prompt: "Level (number):" },
  { key: "description", prompt: "Description:" },
];

const NPC_WIZARD_STEPS: WizardStep[] = [
  { key: "id", prompt: "ID (e.g. n1):" },
  { key: "name", prompt: "Name:" },
  { key: "role", prompt: "Role:" },
  { key: "location", prompt: "Location:" },
  { key: "attitudeTowardParty", prompt: "Attitude:" },
  { key: "description", prompt: "Description:" },
];

const LOCATION_WIZARD_STEPS: WizardStep[] = [
  { key: "id", prompt: "ID (e.g. l1):" },
  { key: "name", prompt: "Name:" },
  { key: "region", prompt: "Region:" },
  { key: "description", prompt: "Description:" },
];
```

- [ ] **Step 2: Update AppState and inputs**

Change `AppState` and the `useInput` hook to handle the new modes. Also import `writeCampaign`.

```tsx
// Update AppState
type AppState = "nav" | "list" | "detail" | "edit" | "create";

// Update useInput
  useInput((input, key) => {
    // Disable global keys when in wizard forms
    if (appState === "edit" || appState === "create") return;

    if (key.escape) {
      if (appState === "detail") setAppState("list");
      else if (appState === "list") setAppState("nav");
      return;
    }
    
    if (input === 'e' && appState === "detail") {
      setAppState("edit");
      return;
    }

    if (input === 'c' && (appState === "nav" || appState === "list")) {
      setAppState("create");
      return;
    }
    
    // q to quit anytime (unless typing in a future form)
    if (input === 'q') {
      exit();
      return;
    }
  });
```

- [ ] **Step 3: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add cli/App.tsx
git commit -m "feat(cli): define wizard steps and add edit/create state handlers"
```

### Task 3: Render Wizard and Handle Saves

**Files:**
- Modify: `cli/App.tsx`

- [ ] **Step 1: Add save logic**

Add the `handleSave` function inside `App` (above `if (error)`):

```tsx
  const handleSave = async (mutatedData: any) => {
    if (!data) return;
    
    // Ensure numeric fields are cast (basic safety for form string outputs)
    if (mutatedData.level) mutatedData.level = parseInt(mutatedData.level, 10);
    
    const newData = { ...data };
    
    const arrayName = selectedCategory === "timeline" ? "events" : selectedCategory;
    const arrayPath = selectedCategory === "timeline" ? newData.timeline.events : (newData as any)[selectedCategory];
    
    if (appState === "edit") {
      const index = arrayPath.findIndex((item: any) => item.id === selectedEntityId);
      if (index !== -1) {
        arrayPath[index] = { ...arrayPath[index], ...mutatedData };
      }
    } else if (appState === "create") {
      arrayPath.push(mutatedData);
      setSelectedEntityId(mutatedData.id); // Auto-select new item
    }

    try {
      const filePath = path.join(process.cwd(), "data", "campaign.yml");
      await writeCampaign(newData, filePath);
      setData(newData); // update local state
      setAppState("detail");
    } catch (e: any) {
      setError(e.message);
    }
  };
```

- [ ] **Step 2: Render the Wizard conditionally**

In the Content Pane render block, add the wizard logic. Also update footer instructions.

```tsx
        {/* Content Pane */}
        <Box 
          flexGrow={1} 
          paddingX={1} 
          borderColor={appState !== "nav" ? "blue" : "gray"}
          borderStyle={appState !== "nav" ? "single" : undefined}
          flexDirection="column"
        >
          {appState === "edit" || appState === "create" ? (
            <Wizard 
              steps={
                selectedCategory === "players" ? PLAYER_WIZARD_STEPS : 
                selectedCategory === "npcs" ? NPC_WIZARD_STEPS : 
                LOCATION_WIZARD_STEPS // Add more as needed
              }
              initialData={appState === "edit" ? activeItemData : {}}
              onSubmit={handleSave}
              onCancel={() => setAppState(appState === "edit" ? "detail" : "list")}
            />
          ) : appState === "detail" ? (
             // ... existing detail code ...
```

Update footer:
```tsx
      {/* Footer */}
      {appState !== "edit" && appState !== "create" && (
        <Box borderTop={true} borderStyle="single" paddingX={1} borderBottom={false} borderLeft={false} borderRight={false}>
          <Text color="gray">[Enter] Select | [Esc] Go Back | [e] Edit | [c] Create | [q] Quit</Text>
        </Box>
      )}
```

- [ ] **Step 3: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add cli/App.tsx
git commit -m "feat(cli): render wizard and wire up saving logic to campaign yml"
```