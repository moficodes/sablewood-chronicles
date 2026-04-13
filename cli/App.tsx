import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { readCampaign } from "./data";
import type { Campaign } from "./schema";
import path from "path";

export function App() {
  const { exit } = useApp();
  const [data, setData] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePane, setActivePane] = useState<"nav" | "main">("nav");

  useEffect(() => {
    const filePath = path.join(process.cwd(), "data", "campaign.yml");
    readCampaign(filePath)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useInput((input, key) => {
    if (key.escape || (input === 'q' && activePane === "nav")) {
      exit();
    }
    if (key.tab) {
      setActivePane(prev => prev === "nav" ? "main" : "nav");
    }
  });

  if (error) return <Text color="red">Error loading data: {error}</Text>;
  if (!data) return <Text>Loading campaign data...</Text>;

  return (
    <Box flexDirection="column" minHeight={20} borderStyle="single">
      {/* Header */}
      <Box borderBottom={true} borderStyle="single" paddingX={1} borderTop={false} borderLeft={false} borderRight={false}>
        <Text bold>Sablewood Chronicles - CLI Manager | </Text>
        <Text color="green">Next Session: {data.home.nextSession}</Text>
      </Box>

      {/* Main Body */}
      <Box flexDirection="row" flexGrow={1}>
        {/* Nav Pane */}
        <Box 
          width="25%" 
          borderRight={true} borderStyle="single" borderTop={false} borderBottom={false} borderLeft={false}
          borderColor={activePane === "nav" ? "blue" : "gray"}
          flexDirection="column"
          paddingX={1}
        >
          <Text color={activePane === "nav" ? "white" : "gray"}>1. Players</Text>
          <Text color={activePane === "nav" ? "white" : "gray"}>2. NPCs</Text>
          <Text color={activePane === "nav" ? "white" : "gray"}>3. Locations</Text>
          <Text color={activePane === "nav" ? "white" : "gray"}>4. Timeline</Text>
        </Box>

        {/* Content Pane */}
        <Box 
          flexGrow={1} 
          paddingX={1} 
          borderColor={activePane === "main" ? "blue" : "gray"}
          borderStyle={activePane === "main" ? "single" : undefined}
        >
          <Text>Select an item from the menu.</Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box borderTop={true} borderStyle="single" paddingX={1} borderBottom={false} borderLeft={false} borderRight={false}>
        <Text color="gray">[tab] Switch Panes | [q] Quit</Text>
      </Box>
    </Box>
  );
}
