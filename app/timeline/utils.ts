import { TimelineEvent, GameTime } from '@/types';

export function formatGameTime(time: GameTime): string {
  let result = `${time.month} ${time.day}, ${time.year}`;
  if (time.era && time.era !== 'The Second Age') {
    result += ` - ${time.era}`;
  }
  if (time.hour !== undefined && time.minute !== undefined) {
    const period = time.hour >= 12 ? 'PM' : 'AM';
    const hour12 = time.hour % 12 || 12;
    const min = time.minute.toString().padStart(2, '0');
    result += ` at ${hour12}:${min} ${period}`;
  }
  return result;
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

export function getTypeColor(type: string) {
  switch (type) {
    case 'combat': return { text: 'text-rose-400', bg: 'bg-rose-400/10', dot: 'bg-rose-400', glow: 'shadow-[0_0_12px_rgba(251,113,133,0.4)]' };
    case 'location_change': return { text: 'text-teal-400', bg: 'bg-teal-400/10', dot: 'bg-teal-400', glow: 'shadow-[0_0_12px_rgba(45,212,191,0.4)]' };
    case 'npc_meet': return { text: 'text-indigo-400', bg: 'bg-indigo-400/10', dot: 'bg-indigo-400', glow: 'shadow-[0_0_12px_rgba(129,140,248,0.4)]' };
    case 'achievement': return { text: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400', glow: 'shadow-[0_0_12px_rgba(251,191,36,0.4)]' };
    case 'drawback': return { text: 'text-stone-400', bg: 'bg-stone-400/10', dot: 'bg-stone-400', glow: 'shadow-[0_0_12px_rgba(168,162,158,0.4)]' };
    default: return { text: 'text-primary', bg: 'bg-primary/10', dot: 'bg-primary', glow: 'shadow-[0_0_12px_rgba(250,192,4,0.4)]' };
  }
}
