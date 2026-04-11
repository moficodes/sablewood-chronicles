import { TimelineEvent } from '@/types';
import { formatGameTime } from './utils';

export function EventCard({ event, align }: { event: TimelineEvent; align: 'left' | 'right' }) {
  return (
    <div className={`w-full md:w-5/12 ${align === 'right' ? 'md:ml-auto' : ''} mb-8`}>
      <div className="bg-surface-container rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Header: Time and Badges */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-on-surface-variant">
            {formatGameTime(event.time)}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold capitalize">
              {event.type.replace(/_/g, ' ')}
            </span>
            {event.sagaArc && (
              <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-semibold capitalize">
                {event.sagaArc.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Body: Title and Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-on-surface">{event.title}</h3>
          <p className="text-on-surface-variant leading-relaxed text-body-lg">
            {event.description}
          </p>
        </div>

        {/* PC Notes */}
        {event.pcNotes && event.pcNotes.length > 0 && (
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-on-surface">Journal Entries</h4>
            <div className="flex flex-col gap-3">
              {event.pcNotes.map((note, idx) => (
                <div key={idx} className="bg-surface-container-high rounded-2xl p-5 italic text-on-surface-variant text-sm">
                  &quot;{note.note}&quot;
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
