// cli/App.tsx (Replace entirely)
import React, { useState, useEffect, useMemo } from "react";
import { Box, Text, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";
import { readCampaign, writeCampaign } from "./data";
import { Wizard, type WizardStep } from "./Wizard";
import type { Campaign } from "./schema";
import path from "path";
import { PlayerDetail, NPCDetail, LocationDetail, EventDetail } from "./components";
import type { PlayerData, NPCData, LocationData, EventData } from "./components";

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

type AppState = "nav" | "list" | "detail" | "edit" | "create";

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

  const handleSave = async (mutatedData: Record<string, unknown>) => {
    if (!data) return;
    
    // Ensure numeric fields are cast (basic safety for form string outputs)
    if (mutatedData.level) mutatedData.level = parseInt(mutatedData.level, 10);
    
    const newData = structuredClone(data);
    
    const arrayPath = selectedCategory === "timeline" ? newData.timeline.events : (newData as Record<string, unknown>)[selectedCategory] as Array<Record<string, unknown>>;
    
    if (appState === "edit") {
      const index = arrayPath.findIndex((item) => item.id === selectedEntityId);
      if (index !== -1) {
        arrayPath[index] = { ...arrayPath[index], ...mutatedData };
      }
    } else if (appState === "create") {
      mutatedData.id = Math.random().toString(36).substring(2, 10);
      arrayPath.push(mutatedData);
      setSelectedEntityId(mutatedData.id); // Auto-select new item
    }

    try {
      const filePath = path.join(process.cwd(), "data", "campaign.yml");
      await writeCampaign(newData, filePath);
      setData(newData); // update local state
      setAppState("detail");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  };

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
          flexBasis="75%"
          paddingX={1} 
          borderColor={appState !== "nav" ? "blue" : "gray"}
          borderStyle={appState !== "nav" ? "single" : undefined}
          flexDirection="column"
          overflow="hidden"
        >
          {appState === "detail" ? (
            <Box flexDirection="column" overflow="hidden">
              {selectedCategory === "players" && <PlayerDetail data={activeItemData as WithId<PlayerData> | null} />}
              {selectedCategory === "npcs" && <NPCDetail data={activeItemData as WithId<NPCData> | null} />}
              {selectedCategory === "locations" && <LocationDetail data={activeItemData as WithId<LocationData> | null} />}
              {selectedCategory === "timeline" && <EventDetail data={activeItemData as WithId<EventData> | null} />}
            </Box>
          ) : appState === "edit" || appState === "create" ? (
            <Wizard 
              steps={
                selectedCategory === "players" ? PLAYER_WIZARD_STEPS : 
                selectedCategory === "npcs" ? NPC_WIZARD_STEPS : 
                selectedCategory === "timeline" ? TIMELINE_WIZARD_STEPS :
                LOCATION_WIZARD_STEPS // Add more as needed
              }
              initialData={appState === "edit" ? activeItemData || {} : {}}
              onSubmit={handleSave}
              onCancel={() => setAppState(appState === "edit" ? "detail" : "list")}
            />
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
      {appState !== "edit" && appState !== "create" && (
        <Box borderTop={true} borderStyle="single" paddingX={1} borderBottom={false} borderLeft={false} borderRight={false}>
          <Text color="gray">[Enter] Select | [Esc] Go Back | [e] Edit | [c] Create | [q] Quit</Text>
        </Box>
      )}
    </Box>
  );
}
