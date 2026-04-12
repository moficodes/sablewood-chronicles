import { TimelineEvent } from '@/types';
import { formatGameTime, getTypeColor } from './utils';
import { MapPin, Trophy, AlertTriangle, Users, Swords, Bookmark } from 'lucide-react';

const TypeIcon = {
  location_change: MapPin,
  achievement: Trophy,
  drawback: AlertTriangle,
  npc_meet: Users,
  combat: Swords,
  general: Bookmark,
};

export function EventCard({ event, align }: { event: TimelineEvent; align: 'left' | 'right' }) {
  const isLeft = align === 'left';
  const style = getTypeColor(event.type);
  const Icon = TypeIcon[event.type as keyof typeof TypeIcon] || Bookmark;
  
  // Pl-10 for mobile so the card content avoids the mobile timeline spine on the left.
  return (
    <div className={`w-full md:w-5/12 flex flex-col gap-4 pl-10 md:pl-0 ${isLeft ? 'md:pr-16 md:mr-auto' : 'md:ml-auto md:pl-16'} mb-24 relative`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${style.bg} ${style.text}`}>
          <Icon className="w-3.5 h-3.5" />
          {event.type.replace('_', ' ')}
        </div>
        <div className="text-sm font-medium text-on-surface-variant tracking-wider">
          {formatGameTime(event.time)}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-3xl md:text-4xl font-serif text-on-surface leading-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-on-surface-variant leading-relaxed text-lg max-w-md mt-2">
        {event.description}
      </p>

      {/* PC Notes / Journal */}
      {event.pcNotes && event.pcNotes.length > 0 && (
        <div className="flex flex-col gap-4 w-full max-w-md mt-6">
          {event.pcNotes.map((note, idx) => (
            <div key={idx} className="bg-surface-container rounded-2xl p-6 relative w-full shadow-sm backdrop-blur-sm">
              <div className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase mb-3 text-left flex justify-between items-center">
                <span>{note.pcId.replace('-', ' ').toUpperCase()}&apos;S JOURNAL</span>
                <span className="opacity-20">≣</span>
              </div>
              <div className="italic text-on-surface text-base leading-relaxed text-left font-serif">
                &quot;{note.note}&quot;
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
