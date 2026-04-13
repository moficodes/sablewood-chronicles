import { Command } from "commander";
import { readCampaign, writeCampaign } from "./data";
import path from "path";

const program = new Command();
const CAMPAIGN_FILE = path.join(process.cwd(), "data", "campaign.yml");

program
  .name("agent")
  .description("Non-TUI CLI for modifying campaign data via automation");

const home = program.command("home").description("Manage home configuration");

home
  .command("update")
  .description("Update home configuration")
  .option("--nextSession <string>", "Next session date/time")
  .option("--lastLocationId <string>", "Last location ID")
  .option("--nextDestinationId <string>", "Next destination ID")
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      if (options.nextSession) data.home.nextSession = options.nextSession;
      if (options.lastLocationId) data.home.lastLocationId = options.lastLocationId;
      if (options.nextDestinationId) data.home.nextDestinationId = options.nextDestinationId;
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log("Home configuration updated successfully.");
    } catch (err) {
      console.error("Error updating home:", err);
      process.exit(1);
    }
  });

const npc = program.command("npc").description("Manage NPCs");

npc.command("list").action(async () => {
  const data = await readCampaign(CAMPAIGN_FILE);
  console.log(JSON.stringify(data.npcs.map((n: any) => ({ id: n.id, name: n.name })), null, 2));
});

npc.command("add")
  .requiredOption("--id <string>", "NPC ID")
  .requiredOption("--name <string>", "NPC Name")
  .option("--role <string>", "NPC Role")
  .option("--location <string>", "NPC Location")
  .option("--description <string>", "NPC Description")
  .action(async (options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.npcs.push(options);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Added NPC: ${options.name}`);
  });

npc.command("update")
  .argument("<id>", "NPC ID")
  .option("--name <string>")
  .option("--role <string>")
  .option("--location <string>")
  .option("--description <string>")
  .action(async (id, options) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    const index = data.npcs.findIndex((n: any) => n.id === id);
    if (index === -1) {
      console.error(`NPC with id ${id} not found.`);
      process.exit(1);
    }
    data.npcs[index] = { ...data.npcs[index], ...options };
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Updated NPC: ${id}`);
  });

npc.command("delete")
  .argument("<id>", "NPC ID")
  .action(async (id) => {
    const data = await readCampaign(CAMPAIGN_FILE);
    data.npcs = data.npcs.filter((n: any) => n.id !== id);
    await writeCampaign(data, CAMPAIGN_FILE);
    console.log(`Deleted NPC: ${id}`);
  });

const location = program.command("location").description("Manage Locations");

location.command("list").action(async () => {
  try {
    const data = await readCampaign(CAMPAIGN_FILE);
    console.log(JSON.stringify(data.locations.map((l: any) => ({ id: l.id, name: l.name })), null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

location.command("add")
  .requiredOption("--id <string>", "Location ID")
  .requiredOption("--name <string>", "Location Name")
  .option("--region <string>", "Location Region")
  .option("--description <string>", "Location Description")
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      data.locations.push({ ...options });
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Added Location: ${options.name}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

location.command("update")
  .argument("<id>", "Location ID")
  .option("--name <string>")
  .option("--region <string>")
  .option("--description <string>")
  .action(async (id, options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const index = data.locations.findIndex((l: any) => l.id === id);
      if (index === -1) {
        console.error(`Location with id ${id} not found.`);
        process.exit(1);
      }
      data.locations[index] = { ...data.locations[index], ...options };
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Updated Location: ${id}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

location.command("delete")
  .argument("<id>", "Location ID")
  .action(async (id) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      data.locations = data.locations.filter((l: any) => l.id !== id);
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Deleted Location: ${id}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

const event = program.command("event").description("Manage Timeline Events");

event.command("list").action(async () => {
  try {
    const data = await readCampaign(CAMPAIGN_FILE);
    console.log(JSON.stringify(data.timeline.events.map((e: any) => ({ id: e.id, title: e.title })), null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

event.command("add")
  .requiredOption("--id <string>", "Event ID")
  .requiredOption("--title <string>", "Event Title")
  .option("--type <string>", "Event Type")
  .option("--description <string>", "Event Description")
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      if (data.timeline.events.some((e: any) => e.id === options.id)) {
        console.error(`Event with id ${options.id} already exists.`);
        process.exit(1);
      }
      data.timeline.events.push({ ...options });
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Added Event: ${options.title}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

event.command("update")
  .argument("<id>", "Event ID")
  .option("--title <string>")
  .option("--type <string>")
  .option("--description <string>")
  .action(async (id, options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const index = data.timeline.events.findIndex((e: any) => e.id === id);
      if (index === -1) {
        console.error(`Event with id ${id} not found.`);
        process.exit(1);
      }
      data.timeline.events[index] = { ...data.timeline.events[index], ...options };
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Updated Event: ${id}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

event.command("delete")
  .argument("<id>", "Event ID")
  .action(async (id) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const exists = data.timeline.events.some((e: any) => e.id === id);
      if (!exists) {
        console.error(`Event with id ${id} not found.`);
        process.exit(1);
      }
      data.timeline.events = data.timeline.events.filter((e: any) => e.id !== id);
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Deleted Event: ${id}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

const player = program.command("player").description("Manage Players");

player.command("list").action(async () => {
  try {
    const data = await readCampaign(CAMPAIGN_FILE);
    console.log(JSON.stringify(data.players.map((p: any) => ({ id: p.id, name: p.name })), null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

player.command("add")
  .requiredOption("--id <string>", "Player ID")
  .requiredOption("--name <string>", "Player Name")
  .option("--class <string>", "Player Class")
  .option("--level <number>", "Player Level", parseInt)
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      if (data.players.some((p: any) => p.id === options.id)) {
        console.error(`Player with id ${options.id} already exists.`);
        process.exit(1);
      }
      data.players.push({ ...options });
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Added Player: ${options.name}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

player.command("update")
  .argument("<id>", "Player ID")
  .option("--name <string>")
  .option("--class <string>")
  .option("--level <number>", "Player Level", parseInt)
  .action(async (id, options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const index = data.players.findIndex((p: any) => p.id === id);
      if (index === -1) {
        console.error(`Player with id ${id} not found.`);
        process.exit(1);
      }
      data.players[index] = { ...data.players[index], ...options };
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Updated Player: ${id}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

player.command("delete")
  .argument("<id>", "Player ID")
  .action(async (id) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const exists = data.players.some((p: any) => p.id === id);
      if (!exists) {
        console.error(`Player with id ${id} not found.`);
        process.exit(1);
      }
      data.players = data.players.filter((p: any) => p.id !== id);
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Deleted Player: ${id}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

const quest = program.command("quest").description("Manage Quests");

quest.command("list").action(async () => {
  try {
    const data = await readCampaign(CAMPAIGN_FILE);
    console.log("Active Quest:", data.home.activeQuest?.title || "None");
    console.log("Quest List:", JSON.stringify(data.home.questList.map((q: any) => q.title), null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

quest.command("add")
  .requiredOption("--title <string>", "Quest Title")
  .requiredOption("--status <string>", "Quest Status")
  .requiredOption("--locationId <string>", "Location ID")
  .option("--description <string>", "Quest Description")
  .action(async (options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      if (data.home.questList.some((q: any) => q.title === options.title)) {
        console.error(`Quest with title ${options.title} already exists.`);
        process.exit(1);
      }
      data.home.questList.push({ ...options });
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Added Quest: ${options.title}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

quest.command("update")
  .argument("<title>", "Quest Title")
  .option("--status <string>")
  .option("--locationId <string>")
  .option("--description <string>")
  .action(async (title, options) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const index = data.home.questList.findIndex((q: any) => q.title === title);
      
      if (index === -1) {
        if (data.home.activeQuest && data.home.activeQuest.title === title) {
          data.home.activeQuest = { ...data.home.activeQuest, ...options };
        } else {
          console.error(`Quest with title ${title} not found in questList or activeQuest.`);
          process.exit(1);
        }
      } else {
        data.home.questList[index] = { ...data.home.questList[index], ...options };
      }
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Updated Quest: ${title}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

quest.command("delete")
  .argument("<title>", "Quest Title")
  .action(async (title) => {
    try {
      const data = await readCampaign(CAMPAIGN_FILE);
      const exists = data.home.questList.some((q: any) => q.title === title) || 
                     (data.home.activeQuest && data.home.activeQuest.title === title);
      
      if (!exists) {
        console.error(`Quest with title ${title} not found.`);
        process.exit(1);
      }
      
      data.home.questList = data.home.questList.filter((q: any) => q.title !== title);
      if (data.home.activeQuest && data.home.activeQuest.title === title) {
        // We shouldn't delete the node if it's the schema requires an activeQuest object.
        // For now, let's reset it if it matches. This assumes schema validation won't fail.
        // A safer way would be to just let the array filter handle "questList" and maybe 
        // leave activeQuest alone unless explicitly clearing it, but we'll try to clear the title.
        data.home.activeQuest = { title: "", status: "", locationId: "" };
      }
      
      await writeCampaign(data, CAMPAIGN_FILE);
      console.log(`Deleted Quest: ${title}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
