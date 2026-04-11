import { TimelineEvent, GameTime } from '@/types';

export function formatGameTime(time: GameTime): string {
  return `${time.month} ${time.day}, ${time.year} - ${time.era}`;
}

export function filterEvents(
  events: TimelineEvent[],
  filters: {
    type?: string[];
    sagaArc?: string[];
    pcId?: string[];
  }
): TimelineEvent[] {
  return events.filter((event) => {
    // 1. Filter by Type
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(event.type)) return false;
    }

    // 2. Filter by Saga Arc
    if (filters.sagaArc && filters.sagaArc.length > 0) {
      if (!event.sagaArc || !filters.sagaArc.includes(event.sagaArc)) return false;
    }

    // 3. Filter by PC Notes presence
    if (filters.pcId && filters.pcId.length > 0) {
      if (!event.pcNotes || event.pcNotes.length === 0) return false;
      const eventPcIds = event.pcNotes.map((note) => note.pcId);
      const hasMatchingPc = filters.pcId.some((id) => eventPcIds.includes(id));
      if (!hasMatchingPc) return false;
    }

    return true;
  });
}
