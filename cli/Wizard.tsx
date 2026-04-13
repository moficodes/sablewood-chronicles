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
