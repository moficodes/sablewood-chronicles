import { getCampaignData } from "@/src/lib/data";
import { TimelineData } from '@/types';
import { TimelineClient } from './timeline-client';

export default function TimelinePage() {
  const { timeline: eventsDataFile } = getCampaignData();
  const timelineData = eventsDataFile as TimelineData;

  return <TimelineClient timelineData={timelineData} />;
}
