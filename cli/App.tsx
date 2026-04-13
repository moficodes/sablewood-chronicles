// cli/App.tsx (Replace entirely)
import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";
import { readCampaign } from "./data";
import type { Campaign } from "./schema";
import path from "path";
import { PlayerDetail, NPCDetail, LocationDetail, EventDetail } from "./components";

type AppState = "nav" | "list" | "detail";

const navItems = [
  { label: 'Players', value: 'players' },
  { label: 'NPCs', value: 'npcs' },
  { label: 'Locations', value: 'locations' },
  { label: 'Timeline', value: 'timeline' },
];

export function App() {
  const { exit } = useApp();
  const [data, setData] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [appState, setAppState] = useState<AppState>("nav");
  const [selectedCategory, setSelectedCategory] = useState("players");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  useEffect(() => {
    const filePath = path.join(process.cwd(), "data", "campaign.yml");
    readCampaign(filePath)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      if (appState === "detail") setAppState("list");
      else exit();
      return;
    }
    
    if (input === 'q' && appState !== "detail") {
      exit();
      return;
    }
    
    if (key.tab) {
      if (appState === "nav") setAppState("list");
      else if (appState === "list") setAppState("nav");
    }
  });

  if (error) return <Text color="red">Error loading data: {error}</Text>;
  if (!data) return <Text>Loading campaign data...</Text>;

  // Compute current list items for the right pane based on category
  let listItems: {label: string, value: string}[] = [];
  if (selectedCategory === "players") listItems = data.players.map((p: any) => ({ label: p.name, value: p.id }));
  if (selectedCategory === "npcs") listItems = data.npcs.map((n: any) => ({ label: n.name, value: n.id }));
  if (selectedCategory === "locations") listItems = data.locations.map((l: any) => ({ label: l.name, value: l.id }));
  if (selectedCategory === "timeline") listItems = data.timeline.events.map((e: any) => ({ label: e.title, value: e.id }));

  const activeItemData = selectedEntityId 
    ? (data as any)[selectedCategory === 'timeline' ? 'events' : selectedCategory]?.find((x: any) => x.id === selectedEntityId) || 
      data.timeline.events.find((x: any) => x.id === selectedEntityId) // fallback for timeline nested search
    : null;

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
          borderColor={appState === "nav" ? "blue" : "gray"}
          flexDirection="column"
          paddingX={1}
        >
          <SelectInput 
            items={navItems} 
            isFocused={appState === "nav"}
            onSelect={(item) => setSelectedCategory(item.value)}
            onHighlight={(item) => setSelectedCategory(item.value)}
          />
        </Box>

        {/* Content Pane */}
        <Box 
          flexGrow={1} 
          paddingX={1} 
          borderColor={appState !== "nav" ? "blue" : "gray"}
          borderStyle={appState !== "nav" ? "single" : undefined}
          flexDirection="column"
        >
          {appState === "detail" ? (
            <Box>
              {selectedCategory === "players" && <PlayerDetail data={activeItemData} />}
              {selectedCategory === "npcs" && <NPCDetail data={activeItemData} />}
              {selectedCategory === "locations" && <LocationDetail data={activeItemData} />}
              {selectedCategory === "timeline" && <EventDetail data={activeItemData} />}
            </Box>
          ) : (
            <SelectInput 
              items={listItems} 
              isFocused={appState === "list"}
              onSelect={(item) => {
                setSelectedEntityId(item.value);
                setAppState("detail");
              }}
            />
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box borderTop={true} borderStyle="single" paddingX={1} borderBottom={false} borderLeft={false} borderRight={false}>
        <Text color="gray">[tab] Switch Panes | [Enter] Select Item | [Esc] Go Back/Quit</Text>
      </Box>
    </Box>
  );
}
