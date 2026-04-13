"use client";

import Link from "next/link";
import { useState } from "react";
import { Player } from "@/types";
import { Shadows_Into_Light, Kalam } from "next/font/google";

const fontShadows = Shadows_Into_Light({ subsets: ["latin"], weight: ["400"] });
const fontKalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] });

const PlayerCard = ({ player }: { player: Player }) => (
  <Link href={`/players/${player.id}`} className="group flex flex-col items-center gap-3 w-48 transition-transform hover:-translate-y-1">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={player.image} alt={player.name} className="w-24 h-24 rounded-full object-cover shadow-sm group-hover:ring-4 ring-primary-container transition-all" />
    <div className="text-center">
      <div className="text-lg font-bold text-on-surface leading-tight">{player.name}</div>
      <div className="text-sm text-primary uppercase font-bold tracking-wider mt-1">{player.class}</div>
    </div>
  </Link>
);

export default function PlayerList({ players }: { players: Player[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!players || players.length === 0) {
    return (
      <section className="w-full bg-surface-container-low py-16">
        <div className="max-w-3xl mx-auto px-4 flex justify-center">
          <div className={`bg-[#f4ebd8] p-8 md:p-12 shadow-md transform rotate-2 rounded-2xl relative flex flex-col items-center text-center max-w-lg w-full ${fontKalam.className}`}>
            {/* Pin */}
            <div className="absolute top-3 md:top-4 right-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-slate-800 shadow-lg"></div>
            
            <h3 className={`text-5xl md:text-6xl font-bold text-red-900 mb-8 tracking-wider uppercase mt-4 ${fontShadows.className}`}>Wanted: Heroes</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#3e3101] mb-6 leading-relaxed">The tavern is quiet. Too quiet.</p>
            <p className="text-xl md:text-2xl text-[#3e3101]/80 mb-4 italic">Inquire within... survival not guaranteed.</p>
          </div>
        </div>
      </section>
    );
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % players.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + players.length) % players.length);

  return (
    <section className="w-full bg-surface-container-low py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop View: Centered List (hidden on small screens) */}
        <div className="hidden md:flex justify-center flex-wrap gap-8 pt-6 pb-4">
          {players.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>

        {/* Mobile View: Carousel (hidden on medium screens and up) */}
        <div className="flex md:hidden flex-col items-center pt-6 pb-4 overflow-hidden relative w-full">
          {/* Carousel Track */}
          <div className="w-full relative h-[180px]">
            <div 
              className="absolute flex transition-transform duration-300 ease-in-out w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {players.map(player => (
                <div key={`mobile-${player.id}`} className="w-full flex-shrink-0 flex justify-center">
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Controls */}
          {players.length > 1 && (
            <div className="flex gap-4 items-center mt-4">
              <button 
                onClick={prev}
                className="bg-surface-container-high text-on-surface p-3 rounded-full hover:bg-surface-container-highest transition-colors shadow-sm cursor-pointer"
                aria-label="Previous player"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex gap-2">
                {players.map((_, i) => (
                  <button 
                    key={`dot-${i}`} 
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${i === currentIndex ? 'bg-primary' : 'bg-surface-container-highest'}`}
                  />
                ))}
              </div>

              <button 
                onClick={next}
                className="bg-surface-container-high text-on-surface p-3 rounded-full hover:bg-surface-container-highest transition-colors shadow-sm cursor-pointer"
                aria-label="Next player"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
