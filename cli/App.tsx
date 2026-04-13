// cli/App.tsx (Replace entirely)
import React, { useState, useEffect, useMemo } from "react";
import { Box, Text, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";
import { readCampaign } from "./data";
import type { Campaign } from "./schema";
import path from "path";
import { PlayerDetail, NPCDetail, LocationDetail, EventDetail } from "./components";
import type { PlayerData, NPCData, LocationData, EventData } from "./components";

function useTerminalSize() {
  const [size, setSize] = useState({
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    };
    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);

  return size;
}

type WithId<T> = T & { id: string };

type AppState = "nav" | "list" | "detail";

const navItems = [
  { label: 'Players', value: 'players' },
  { label: 'NPCs', value: 'npcs' },
  { label: 'Locations', value: 'locations' },
  { label: 'Timeline', value: 'timeline' },
];

export function App() {
  const { exit } = useApp();
  const { columns, rows } = useTerminalSize();
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
      else if (appState === "list") setAppState("nav");
      return;
    }
    
    // q to quit anytime (unless typing in a future form)
    if (input === 'q') {
      exit();
      return;
    }
  });

  // Compute current list items for the right pane based on category
  const listItems = useMemo(() => {
    if (!data) return [];
    switch (selectedCategory) {
      case "players":
        return data.players.map((p: WithId<PlayerData>) => ({ key: `p-${p.id}`, label: p.name, value: p.id }));
      case "npcs":
        return data.npcs.map((n: WithId<NPCData>) => ({ key: `n-${n.id}`, label: n.name, value: n.id }));
      case "locations":
        return data.locations.map((l: WithId<LocationData>) => ({ key: `l-${l.id}`, label: l.name, value: l.id }));
      case "timeline":
        return data.timeline.events.map((e: WithId<EventData>) => ({ key: `e-${e.id}`, label: e.title, value: e.id }));
      default:
        return [];
    }
  }, [data, selectedCategory]);

  const activeItemData = useMemo(() => {
    if (!data || !selectedEntityId) return null;

    switch (selectedCategory) {
      case "players":
        return data.players.find((p: WithId<PlayerData>) => p.id === selectedEntityId) || null;
      case "npcs":
        return data.npcs.find((n: WithId<NPCData>) => n.id === selectedEntityId) || null;
      case "locations":
        return data.locations.find((l: WithId<LocationData>) => l.id === selectedEntityId) || null;
      case "timeline":
        return data.timeline.events.find((e: WithId<EventData>) => e.id === selectedEntityId) || null;
      default:
        return null;
    }
  }, [data, selectedCategory, selectedEntityId]);

  if (error) return <Text color="red">Error loading data: {error}</Text>;
  if (!data) return <Text>Loading campaign data...</Text>;

  return (
    <Box flexDirection="column" width={columns} height={rows} borderStyle="single">
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
            onSelect={(item) => {
              setSelectedCategory(item.value);
              setAppState("list");
            }}
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
              {selectedCategory === "players" && <PlayerDetail data={activeItemData as WithId<PlayerData> | null} />}
              {selectedCategory === "npcs" && <NPCDetail data={activeItemData as WithId<NPCData> | null} />}
              {selectedCategory === "locations" && <LocationDetail data={activeItemData as WithId<LocationData> | null} />}
              {selectedCategory === "timeline" && <EventDetail data={activeItemData as WithId<EventData> | null} />}
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
        <Text color="gray">[Enter] Select | [Esc] Go Back | [q] Quit</Text>
      </Box>
    </Box>
  );
}
