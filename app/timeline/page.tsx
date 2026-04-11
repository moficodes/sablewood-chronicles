'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TimelineEvent } from '@/types';
import eventsData from './data.json';
import { EventCard } from './EventCard';
import { filterEvents } from './utils';

const EVENTS_PER_PAGE = 5;

export default function TimelinePage() {
  const [allEvents] = useState<TimelineEvent[]>(eventsData as TimelineEvent[]);
  const [page, setPage] = useState(1);
  
  // Minimal filter state for now, UI added in next task
  const [filters] = useState({ type: [], sagaArc: [], pcId: [] });
  const [prevFilters, setPrevFilters] = useState(filters);

  // Adjust state during render to reset pagination when filters change
  if (filters !== prevFilters) {
    setPage(1);
    setPrevFilters(filters);
  }

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
      
      {/* Filters Placeholder */}
      <div className="mb-12 p-4 bg-surface-container rounded-2xl">
         <p className="text-center text-on-surface-variant">Filters will go here</p>
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
