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
  
  cachedData = data;
  return data;
}
