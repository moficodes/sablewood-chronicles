'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { TimelineEvent, EventType, SagaArc, TimelineData } from '@/types';
import { EventCard } from './EventCard';
import { filterEvents, getTypeColor } from './utils';

const EVENTS_PER_PAGE = 10;

// Helper to group events by sagaArc maintaining order
function groupEventsByArc(events: TimelineEvent[]) {
  const groups: { arc: string; events: TimelineEvent[] }[] = [];
  let currentArc = '';
  let currentGroup: TimelineEvent[] = [];

  events.forEach(event => {
    const arc = event.sagaArc || 'ungrouped';
    if (arc !== currentArc) {
      if (currentGroup.length > 0) {
        groups.push({ arc: currentArc, events: currentGroup });
      }
      currentArc = arc;
      currentGroup = [event];
    } else {
      currentGroup.push(event);
    }
  });

  if (currentGroup.length > 0) {
    groups.push({ arc: currentArc, events: currentGroup });
  }

  return groups;
}

export function TimelineClient({ timelineData }: { timelineData: TimelineData }) {
  // Extract unique values for filters
  const EVENT_TYPES = useMemo(() => Array.from(new Set(timelineData.events.map(e => e.type))) as EventType[], [timelineData.events]);
  const SAGA_ARCS = useMemo(() => Array.from(new Set(timelineData.events.map(e => e.sagaArc).filter(Boolean))) as SagaArc[], [timelineData.events]);
  const PC_IDS = useMemo(() => Array.from(new Set(timelineData.events.flatMap(e => e.pcNotes?.map(n => n.pcId) || []))), [timelineData.events]);

  const allEvents = timelineData.events;
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [collapsedArcs, setCollapsedArcs] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<{ type: string[]; sagaArc: string[]; pcId: string[] }>({ 
    type: [], 
    sagaArc: [], 
    pcId: [] 
  });

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
    setPage(1); // Reset page on filter change
  };

  const toggleArc = (arc: string) => {
    setCollapsedArcs(prev => {
      const next = new Set(prev);
      if (next.has(arc)) {
        next.delete(arc);
      } else {
        next.add(arc);
      }
      return next;
    });
  };

  const handleArcSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, sagaArc: value ? [value] : [] }));
    setPage(1);
  };

  const handlePcSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, pcId: value ? [value] : [] }));
    setPage(1);
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => filterEvents(allEvents, filters), [allEvents, filters]);

  const visibleEvents = useMemo(() => {
    return filteredEvents.slice(0, page * EVENTS_PER_PAGE);
  }, [filteredEvents, page]);

  const eventGroups = useMemo(() => {
    let globalIndex = 0;
    return groupEventsByArc(visibleEvents).map(group => ({
      ...group,
      items: group.events.map(event => ({
        event,
        align: (globalIndex++) % 2 === 0 ? 'left' as const : 'right' as const
      }))
    }));
  }, [visibleEvents]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-sm tracking-widest text-on-surface-variant uppercase mb-4">{timelineData.title}</h2>
        <h1 className="text-5xl md:text-7xl font-serif text-on-surface mb-6 italic">{timelineData.subtitle}</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
          {timelineData.description}
        </p>
      </div>
      
      {/* Timeline Layout */}
      <div className="relative">
        {/* The central spine (left on mobile, center on md+) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-surface-container-highest transform -translate-x-1/2 z-0 rounded-full"></div>

        <div className="flex flex-col gap-16">
          {eventGroups.map((group, groupIndex) => {
            const isCollapsed = collapsedArcs.has(group.arc);
            return (
              <div key={`${group.arc}-${groupIndex}`} className="relative z-10">
                {/* Arc Banner */}
                {group.arc !== 'ungrouped' && (
                  <div className="flex md:justify-center justify-start pl-10 md:pl-0 mb-16 relative">
                    <button 
                      onClick={() => toggleArc(group.arc)}
                      className="bg-surface-container px-8 py-6 rounded-2xl flex flex-col items-center gap-2 hover:bg-surface-container-high transition-colors text-center w-full max-w-sm cursor-pointer shadow-sm relative z-20"
                    >
                      <h3 className="text-2xl font-serif text-primary italic">
                        {group.arc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs tracking-widest text-on-surface-variant uppercase">
                          {isCollapsed ? 'Expand Arc' : 'Active Campaign Arc'}
                        </span>
                        {isCollapsed ? <ChevronDown className="w-4 h-4 text-on-surface-variant" /> : <ChevronUp className="w-4 h-4 text-on-surface-variant" />}
                      </div>
                    </button>
                  </div>
                )}

                {/* Events in the Arc */}
                {!isCollapsed && (
                  <div className="flex flex-col">
                    {group.items.map(({ event, align }) => {
                      const style = getTypeColor(event.type);
                      
                      return (
                        <div key={event.id} className="relative">
                          {/* Spine node indicator (left on mobile, center on md+) */}
                          <div className={`absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full ${style.dot} transform -translate-x-1/2 z-10 ${style.glow} ring-4 ring-background`}>
                          </div>
                          
                          <EventCard 
                            event={event} 
                            align={align} 
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10 w-full" />
      </div>
      
      <div className="mt-32 pt-16 flex justify-between items-center text-xs tracking-widest text-on-surface-variant uppercase">
        <div className="flex gap-8">
          <span>Privacy Sigils</span>
          <span>Archive Rules</span>
        </div>
        <div className="font-serif italic capitalize text-lg text-primary/80">Lest we forget the fallen.</div>
        <div>© 1205 The Obsidian Chronicle</div>
      </div>

      {/* Floating Action Button for Filters */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 focus:outline-none"
        >
          <Filter className="w-6 h-6" />
        </button>

        {isFiltersOpen && (
          <div className="absolute bottom-20 right-0 w-80 p-6 bg-surface-container-high rounded-3xl shadow-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <h3 className="text-lg font-serif text-on-surface">Filters</h3>
            
            {/* Filter by Type (Buttons) */}
            <div>
              <h4 className="text-xs tracking-widest text-on-surface-variant uppercase mb-3">Event Type</h4>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(type => (
                  <button 
                    key={type}
                    onClick={() => toggleFilter('type', type)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                      filters.type.includes(type) ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface hover:bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Arc (Dropdown) */}
            <div>
              <h4 className="text-xs tracking-widest text-on-surface-variant uppercase mb-3">Campaign Arc</h4>
              <select 
                className="w-full bg-surface text-on-surface text-sm rounded-2xl px-4 py-3 border-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                value={filters.sagaArc[0] || ''}
                onChange={handleArcSelect}
              >
                <option value="">All Arcs</option>
                {SAGA_ARCS.map(arc => (
                  <option key={arc} value={arc}>
                    {arc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by PC Notes (Dropdown) */}
            <div>
              <h4 className="text-xs tracking-widest text-on-surface-variant uppercase mb-3">Journal Entries</h4>
              <select 
                className="w-full bg-surface text-on-surface text-sm rounded-2xl px-4 py-3 border-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                value={filters.pcId[0] || ''}
                onChange={handlePcSelect}
              >
                <option value="">All Entries</option>
                {PC_IDS.map(id => (
                  <option key={id} value={id}>
                    {id.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Close button for mobile accessibility */}
            <button 
              onClick={() => setIsFiltersOpen(false)}
              className="mt-2 w-full py-3 bg-surface hover:bg-surface-container-highest text-on-surface rounded-2xl text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
