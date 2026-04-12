import Link from "next/link";
import { Caveat, Kalam, Shadows_Into_Light } from "next/font/google";
import { getCampaignData } from "@/lib/data";
import { HomeData, Player, Location } from "@/types";
import { ArrowRight, PlaneTakeoff, Shield } from "lucide-react";
import PlayerList from "./components/player-list";

// Load handwriting fonts for the Quest Board
const fontCaveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });
const fontKalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] });
const fontShadows = Shadows_Into_Light({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const { home: homeDataRaw, players: playersDataRaw, locations: locationsDataRaw } = getCampaignData();

  const homeData: HomeData = homeDataRaw as unknown as HomeData;
  const players: Player[] = playersDataRaw as unknown as Player[];
  const locations: Location[] = locationsDataRaw as unknown as Location[];

  const lastLocation = locations.find(l => l.id === homeData.lastLocationId);
  const nextLocation = locations.find(l => l.id === homeData.nextDestinationId);

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* 1. Welcome the players */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
          Sablewood Chronicles
        </h1>
        <p className="text-xl text-on-surface max-w-2xl mx-auto opacity-80">
          Welcome to the living record of our adventures, heroes, and the world we shape together.
        </p>
      </section>

      {/* 2. Screen width horizontal list of party members */}
      <PlayerList players={players} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        {/* 3. Banner of notice for next session */}
        {homeData.nextSession && (
          <section className="bg-secondary-container text-on-secondary-container rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-sm uppercase font-bold tracking-widest opacity-80 mb-1">Next Session</h2>
              <p className="text-2xl md:text-3xl font-bold">{homeData.nextSession}</p>
            </div>
            <div className="hidden md:block">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-lowest text-secondary">
                <Shield size={32} />
              </span>
            </div>
          </section>
        )}

        {/* 4. Flight notification style locations */}
        {(lastLocation || nextLocation) && (
          <section className="bg-surface-container-lowest border-2 border-surface-container rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
            <h2 className="text-sm uppercase font-bold text-outline-variant tracking-widest mb-6 text-center">Journey Status</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative z-10">
              
              {/* Last Location */}
              <div className="flex-1 text-center md:text-left w-full">
                <div className="text-sm text-primary font-bold uppercase tracking-wider mb-2">Departed</div>
                <div className="text-3xl font-bold text-on-surface">{lastLocation?.name || "Unknown"}</div>
                <div className="text-outline-variant">{lastLocation?.region || ""}</div>
              </div>

              {/* Connecting Arrow/Flight Path */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center px-4 md:px-8">
                <div className="h-1 w-full md:w-32 bg-outline-variant/30 rounded-full flex items-center justify-center relative">
                  <PlaneTakeoff className="text-primary absolute bg-surface-container-lowest px-2" size={40} />
                </div>
                <div className="text-sm font-bold text-outline-variant mt-4">EN ROUTE</div>
              </div>

              {/* Next Location */}
              <div className="flex-1 text-center md:text-right w-full">
                <div className="text-sm text-secondary font-bold uppercase tracking-wider mb-2">Destination</div>
                <div className="text-3xl font-bold text-on-surface">{nextLocation?.name || "Unknown"}</div>
                <div className="text-outline-variant">{nextLocation?.region || ""}</div>
              </div>
            </div>
          </section>
        )}

        {/* 5. Current Active Quest */}
        {homeData.activeQuest && (
          <section className="bg-surface-dim rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-sm uppercase font-bold text-primary tracking-widest mb-4">Current Main Objective</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-on-surface mb-6">{homeData.activeQuest.title}</h3>
            <p className="text-xl text-on-surface opacity-80 max-w-3xl mx-auto">
              {homeData.activeQuest.description}
            </p>
          </section>
        )}
      </div>

      {/* 6. Quest Board (Handwritten Style) */}
      <section className="w-full bg-[#e8dac0] py-16 relative shadow-inner overflow-hidden border-y-8 border-[#c9b79c]">
        {/* Wood texture or board background hint */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)" }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className={`text-5xl md:text-6xl text-center mb-16 text-[#3e3101] ${fontShadows.className} font-bold`}>Notice Board</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Quests */}
            {homeData.questList.map((quest, idx) => (
              <div key={`quest-${idx}`} className={`bg-[#fdfbf7] p-6 shadow-md rounded-sm transform ${idx % 2 === 0 ? 'rotate-2' : '-rotate-1'} relative ${fontKalam.className}`}>
                {/* Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-sm border border-red-950"></div>
                
                <h3 className="text-3xl font-bold text-[#3e3101] mb-3">{quest.title}</h3>
                {quest.description && <p className="text-xl text-[#3e3101] mb-4 leading-relaxed">{quest.description}</p>}
                <div className="text-xl font-bold text-[#8d34b4]">Status: {quest.status}</div>
              </div>
            ))}

            {/* Most Wanted */}
            {homeData.mostWanted.map((wanted, idx) => (
              <div key={`wanted-${idx}`} className={`bg-[#f4ebd8] p-6 shadow-md transform ${idx % 2 === 0 ? '-rotate-2' : 'rotate-3'} relative flex flex-col items-center text-center ${fontCaveat.className}`}>
                {/* Pin */}
                <div className="absolute top-2 right-4 w-3 h-3 rounded-full bg-slate-800 shadow-sm"></div>
                
                <h3 className={`text-4xl font-bold text-red-900 mb-4 tracking-wider uppercase ${fontShadows.className}`}>Wanted</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wanted.image} alt={wanted.name} className="w-48 h-48 object-cover mb-4 grayscale contrast-125 border-4 border-[#3e3101]" />
                <div className="text-3xl font-bold text-[#3e3101] mb-2">{wanted.name}</div>
                <div className="text-2xl font-bold text-red-800 mb-2">Reward: {wanted.reward}</div>
                {wanted.lastSeenLocation && <div className="text-xl text-[#3e3101]">Last seen: {wanted.lastSeenLocation}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Directory Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/timeline" className="bg-surface-container-low p-8 rounded-3xl hover:bg-surface-container transition-colors group">
            <h3 className="text-2xl font-bold text-primary mb-2 flex items-center justify-between">
              Timeline <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
            </h3>
            <p className="text-on-surface">The chronological record of the party&apos;s journey.</p>
          </Link>
          <Link href="/locations" className="bg-surface-container-low p-8 rounded-3xl hover:bg-surface-container transition-colors group">
            <h3 className="text-2xl font-bold text-secondary mb-2 flex items-center justify-between">
              Locations <ArrowRight className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
            </h3>
            <p className="text-on-surface">Maps, places, and significant areas visited.</p>
          </Link>
          <Link href="/npcs" className="bg-surface-container-low p-8 rounded-3xl hover:bg-surface-container transition-colors group">
            <h3 className="text-2xl font-bold text-tertiary mb-2 flex items-center justify-between">
              Characters <ArrowRight className="text-tertiary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
            </h3>
            <p className="text-on-surface">People of interest met along the way.</p>
          </Link>
        </div>
      </section>

    </div>
  );
}
