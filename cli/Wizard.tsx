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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const initData = initialData || {} as Partial<T>;
  const [draftData, setDraftData] = useState<Partial<T>>({ ...initData });
  
  const firstKey = steps[0]?.key;
  const initial = firstKey && initData ? (initData as Record<string, unknown>)[firstKey] : undefined;
  
  const [currentInput, setCurrentInput] = useState(
    initial !== undefined ? String(initial) : ""
  );
  const [error, setError] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
  });

  const handleSubmit = (value: string) => {
    if (currentStep?.validate) {
      const validationResult = currentStep.validate(value);
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

    const updatedDraft = { ...draftData, [currentStep!.key]: value } as Partial<T>;
    setDraftData(updatedDraft);

    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      const nextVal = (updatedDraft as Record<string, unknown>)[nextStep!.key];
      setCurrentInput(nextVal !== undefined ? String(nextVal) : "");
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onSubmit(updatedDraft as T);
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
