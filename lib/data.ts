import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { CampaignData } from '@/types';

let cachedData: CampaignData | null = null;

export function getCampaignData(): CampaignData {
  if (cachedData && process.env.NODE_ENV === 'production') {
    return cachedData;
  }

  const filePath = path.join(process.cwd(), 'data/campaign.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents) as CampaignData;
  
  // Normalize arrays in case they are empty/null/objects in YAML
  if (!Array.isArray(data.players)) {
    data.players = [];
  }
  if (!Array.isArray(data.locations)) {
    data.locations = [];
  }
  
  cachedData = data;
  return data;
}
