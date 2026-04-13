# Campaign TUI CLI - Hierarchical Navigation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Ink TUI to use a strict hierarchical navigation pattern (Enter to drill down, Esc to go up) instead of using Tab to switch panes.

**Architecture:** We will modify the `useInput` hook and the `SelectInput` `onSelect` handlers in `App.tsx` to properly manage the state transitions between `nav`, `list`, and `detail`.

**Tech Stack:** React, Ink

---

### Task 1: Refactor Navigation State Logic

**Files:**
- Modify: `cli/App.tsx`

- [ ] **Step 1: Modify useInput for Esc logic**

Update the `useInput` hook to handle hierarchical `[Esc]` backing out:
```tsx
  useInput((input, key) => {
    if (key.escape) {
      if (appState === "detail") setAppState("list");
      else if (appState === "list") setAppState("nav");
      else exit(); // Exit if hitting Esc from the top-level NAV
      return;
    }
    
    // q to quit anytime (unless typing in a future form)
    if (input === 'q') {
      exit();
      return;
    }
  });
```

- [ ] **Step 2: Modify SelectInput for Nav Pane**

Update the left Nav Pane's `SelectInput` to change state on selection:
```tsx
          <SelectInput 
            items={navItems} 
            isFocused={appState === "nav"}
            onSelect={(item) => {
              setSelectedCategory(item.value);
              setAppState("list");
            }}
            onHighlight={(item) => setSelectedCategory(item.value)}
          />
```

- [ ] **Step 3: Update Footer Text**

Update the footer text to reflect the new controls:
```tsx
        <Text color="gray">[Enter] Select | [Esc] Go Back | [q] Quit</Text>
```

- [ ] **Step 4: Verify component file compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add cli/App.tsx
git commit -m "fix(cli): change navigation to hierarchical enter/esc paradigm"
```