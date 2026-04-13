import { expect, test } from "bun:test";
import { CampaignSchema } from "./schema";

test("CampaignSchema validates valid data", () => {
  const validData = {
    home: {
      nextSession: "May 1st, 2026 7PM EST",
      activeQuest: { title: "Test", status: "active", locationId: "l1", description: "Desc" },
      questList: [],
      mostWanted: [],
      lastLocationId: "l1",
      nextDestinationId: "l2"
    },
    locations: [],
    timeline: { title: "Title", subtitle: "Sub", description: "Desc", events: [] },
    players: [],
    npcs: []
  };
  
  const result = CampaignSchema.safeParse(validData);
  expect(result.success).toBe(true);
});

test("CampaignSchema rejects missing required fields", () => {
  const invalidData = {
    home: { nextSession: "Time" }
  };
  
  const result = CampaignSchema.safeParse(invalidData);
  expect(result.success).toBe(false);
});
