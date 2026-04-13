// cli/Wizard.tsx
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
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

export interface WizardProps<T extends Record<string, unknown>> {
  steps: WizardStep[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
}

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
    const updatedDraft = structuredClone(draftData) as Partial<T>;
    // If it's empty string, we can either set it or ignore it. Let's set it.
    if (currentQStep.step.type !== 'object' && currentQStep.step.type !== 'array') {
      set(updatedDraft as object, currentQStep.path, value);
    }
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
      const existingArray = get(updatedDraft, currentQStep.path) as Array<Record<string, unknown>> | undefined;
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
      <Text bold color="cyan">Wizard Editor ({queue.length} steps remaining)</Text>
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
