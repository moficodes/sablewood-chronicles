import fs from "fs/promises";
import yaml from "js-yaml";
import { CampaignSchema, type Campaign } from "./schema";

export async function readCampaign(filePath: string): Promise<Campaign> {
  const content = await fs.readFile(filePath, "utf-8");
  const parsed = yaml.load(content);
  return CampaignSchema.parse(parsed);
}

export async function writeCampaign(data: Campaign, filePath: string): Promise<void> {
  // Create backup if file exists
  try {
    await fs.copyFile(filePath, `${filePath}.bak`);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code !== "ENOENT") throw error;
  }

  const yamlStr = yaml.dump(data, { indent: 2 });
  await fs.writeFile(filePath, yamlStr, "utf-8");
}
