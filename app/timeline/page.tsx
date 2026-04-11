'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TimelineEvent, EventType, SagaArc } from '@/types';
import eventsData from './data.json';
import { EventCard } from './EventCard';
import { filterEvents } from './utils';

const EVENTS_PER_PAGE = 5;

// Extract unique values for filters
const EVENT_TYPES = Array.from(new Set((eventsData as TimelineEvent[]).map(e => e.type))) as EventType[];
const SAGA_ARCS = Array.from(new Set((eventsData as TimelineEvent[]).map(e => e.sagaArc).filter(Boolean))) as SagaArc[];
// PC_IDS could also be dynamic, but we stick to standard values or dynamic calculation
const PC_IDS = Array.from(new Set((eventsData as TimelineEvent[]).flatMap(e => e.pcNotes?.map(n => n.pcId) || [])));

export default function TimelinePage() {
  const [allEvents] = useState<TimelineEvent[]>(eventsData as TimelineEvent[]);
  const [page, setPage] = useState(1);
  
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

  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => filterEvents(allEvents, filters), [allEvents, filters]);

  const visibleEvents = useMemo(() => {
    return filteredEvents.slice(0, page * EVENTS_PER_PAGE);
  }, [filteredEvents, page]);

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
      <h1 className="text-4xl font-bold text-on-surface mb-8 text-center">Chronicles</h1>
      
      {/* Filter Controls */}
      <div className="mb-12 p-6 bg-surface-container rounded-2xl flex flex-col gap-6">
        {EVENT_TYPES.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(type => (
                <button 
                  key={type}
                  onClick={() => toggleFilter('type', type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.type.includes(type) ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {SAGA_ARCS.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Filter by Saga Arc</h3>
            <div className="flex flex-wrap gap-2">
              {SAGA_ARCS.map(arc => (
                <button 
                  key={arc}
                  onClick={() => toggleFilter('sagaArc', arc)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.sagaArc.includes(arc) ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {arc.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {PC_IDS.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-3">Filter by PC</h3>
            <div className="flex flex-wrap gap-2">
              {PC_IDS.map(pc => (
                <button 
                  key={pc}
                  onClick={() => toggleFilter('pcId', pc)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filters.pcId.includes(pc) ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {pc}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* The central spine (hidden on mobile, visible on md+) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-surface-container-highest transform -translate-x-1/2"></div>

        <div className="flex flex-col">
          {visibleEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Spine node indicator */}
              <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 z-10 border-4 border-background"></div>
              <EventCard 
                event={event} 
                align={index % 2 === 0 ? 'left' : 'right'} 
              />
            </div>
          ))}
        </div>

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10 w-full" />
      </div>
    </div>
  );
}