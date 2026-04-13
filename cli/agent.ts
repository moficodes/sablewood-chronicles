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

program.parse(process.argv);
