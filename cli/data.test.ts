import { expect, test, afterAll } from "bun:test";
import { readCampaign, writeCampaign } from "./data";
import fs from "fs/promises";
import path from "path";

const TEST_FILE = path.join(process.cwd(), "data", "test_campaign.yml");

const testData = {
  home: {
    nextSession: "Test Session",
    activeQuest: { title: "Q", status: "active", locationId: "1" },
    questList: [],
    mostWanted: [],
    lastLocationId: "1",
    nextDestinationId: "2"
  },
  locations: [],
  timeline: { title: "T", subtitle: "S", description: "D", events: [] },
  players: [],
  npcs: []
};

afterAll(async () => {
  await fs.unlink(TEST_FILE).catch(() => {});
  await fs.unlink(TEST_FILE + ".bak").catch(() => {});
});

test("writeCampaign creates backup and writes valid YAML", async () => {
  await writeCampaign(testData, TEST_FILE);
  
  const newData = { ...testData, home: { ...testData.home, nextSession: "Session 2" } };
  await writeCampaign(newData, TEST_FILE);
  
  const content = await fs.readFile(TEST_FILE, "utf-8");
  expect(content).toContain("nextSession: Session 2");

  const bakContent = await fs.readFile(TEST_FILE + ".bak", "utf-8");
  expect(bakContent).toContain("nextSession: Test Session");
});

test("readCampaign parses and validates YAML", async () => {
  await writeCampaign(testData, TEST_FILE);
  const data = await readCampaign(TEST_FILE);
  expect(data.home.nextSession).toBe("Test Session");
});
