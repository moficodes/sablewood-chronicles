import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";
import { readCampaign } from "./data";
import type { Campaign } from "./schema";
import path from "path";

const navItems = [
  { label: 'Players', value: 'players' },
  { label: 'NPCs', value: 'npcs' },
  { label: 'Locations', value: 'locations' },
  { label: 'Timeline', value: 'timeline' },
];

function RenderContent({ view, data }: { view: string, data: Campaign }) {
  if (view === 'players') {
    return (
      <Box flexDirection="column">
        <Text bold underline color="blue">Players ({data.players.length})</Text>
        <Box flexDirection="column" marginTop={1}>
          {data.players.map((p: any, i: number) => (
            <Text key={i}>• {p.name} <Text color="gray">({p.ancestry} {p.class} lvl {p.level})</Text></Text>
          ))}
        </Box>
      </Box>
    );
  }

  if (view === 'npcs') {
    return (
      <Box flexDirection="column">
        <Text bold underline color="yellow">NPCs ({data.npcs.length})</Text>
        <Box flexDirection="column" marginTop={1}>
          {data.npcs.map((n: any, i: number) => (
            <Text key={i}>• {n.name} <Text color="gray">- {n.role} at {n.location}</Text></Text>
          ))}
        </Box>
      </Box>
    );
  }

  if (view === 'locations') {
    return (
      <Box flexDirection="column">
        <Text bold underline color="green">Locations ({data.locations.length})</Text>
        <Box flexDirection="column" marginTop={1}>
          {data.locations.map((l: any, i: number) => (
            <Text key={i}>• {l.name} <Text color="gray">({l.region})</Text></Text>
          ))}
        </Box>
      </Box>
    );
  }

  if (view === 'timeline') {
    return (
      <Box flexDirection="column">
        <Text bold underline color="magenta">Timeline Events ({data.timeline.events.length})</Text>
        <Box flexDirection="column" marginTop={1}>
          {data.timeline.events.map((e: any, i: number) => (
            <Text key={i}>• {e.title} <Text color="gray">[{e.type}]</Text></Text>
          ))}
        </Box>
      </Box>
    );
  }

  return <Text>Select an item from the menu.</Text>;
}

export function App() {
  const { exit } = useApp();
  const [data, setData] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePane, setActivePane] = useState<"nav" | "main">("nav");
  const [selectedView, setSelectedView] = useState("players");

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
          <SelectInput 
            items={navItems} 
            isFocused={activePane === "nav"}
            onSelect={(item) => setSelectedView(item.value)}
            onHighlight={(item) => setSelectedView(item.value)}
          />
        </Box>

        {/* Content Pane */}
        <Box 
          flexGrow={1} 
          paddingX={1} 
          borderColor={activePane === "main" ? "blue" : "gray"}
          borderStyle={activePane === "main" ? "single" : undefined}
          flexDirection="column"
        >
          <RenderContent view={selectedView} data={data} />
        </Box>
      </Box>

      {/* Footer */}
      <Box borderTop={true} borderStyle="single" paddingX={1} borderBottom={false} borderLeft={false} borderRight={false}>
        <Text color="gray">[tab] Switch Panes | [q] Quit</Text>
      </Box>
    </Box>
  );
}
