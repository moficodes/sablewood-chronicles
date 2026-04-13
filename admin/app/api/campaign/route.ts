import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Path relative to the admin app directory (admin/ -> ../data/campaign.yml)
const getCampaignFilePath = () => path.join(process.cwd(), '../data/campaign.yml');

export async function GET() {
  try {
    const filePath = getCampaignFilePath();
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading campaign.yml:', error);
    return NextResponse.json({ error: 'Failed to read campaign data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json();
    const filePath = getCampaignFilePath();
    
    // Convert back to YAML, preserving block styles for multiline strings
    const newYamlContent = yaml.dump(updatedData, {
      lineWidth: -1, // Don't wrap long lines
      noRefs: true,
    });
    
    fs.writeFileSync(filePath, newYamlContent, 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing campaign.yml:', error);
    return NextResponse.json({ error: 'Failed to save campaign data' }, { status: 500 });
  }
}
