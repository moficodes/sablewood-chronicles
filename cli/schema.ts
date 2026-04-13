import { z } from "zod";

export const QuestSchema = z.object({
  title: z.string(),
  status: z.string(),
  locationId: z.string(),
  description: z.string().optional()
});

export const WantedPersonSchema = z.object({
  name: z.string(),
  reward: z.string(),
  image: z.string().optional(),
  lastSeenLocation: z.string().optional()
});

export const HomeSchema = z.object({
  nextSession: z.string(),
  activeQuest: QuestSchema,
  questList: z.array(QuestSchema),
  mostWanted: z.array(WantedPersonSchema),
  lastLocationId: z.string(),
  nextDestinationId: z.string()
});

export const CampaignSchema = z.object({
  home: HomeSchema,
  locations: z.array(z.any()), // Simplified for initial schema
  timeline: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    events: z.array(z.any())
  }),
  players: z.array(z.any()),
  npcs: z.array(z.any())
});

export type Campaign = z.infer<typeof CampaignSchema>;
