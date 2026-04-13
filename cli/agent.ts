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

program.parse(process.argv);
