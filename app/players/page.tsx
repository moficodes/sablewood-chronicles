import Link from "next/link";
import { getCampaignData } from "@/lib/data";
import { Player } from "@/types";

export default function PlayersPage() {
  const { players: playersData } = getCampaignData();
  const players: Player[] = playersData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">The Party</h1>
      
      {players.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-container-low rounded-[2rem]">
          <p className="text-2xl font-bold text-on-surface mb-2">The tavern is empty...</p>
          <p className="text-outline-variant">No heroes have answered the call yet. Maybe they're all still rolling for stats?</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player) => (
          <Link href={`/players/${player.id}`} key={player.id} className="group outline-none">
            <div className="bg-surface-container-low p-6 rounded-[2rem] relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-primary h-full flex flex-col">
              {/* Background tonal shift */}
              <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-[1.5rem] -z-10 transition-transform duration-500 group-hover:scale-[0.98]"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={player.image} alt={player.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface leading-tight">{player.name}</h2>
                  <p className="text-sm font-medium text-outline-variant mt-1">
                    Lvl {player.level} • {player.ancestry} {player.community}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                 <p className="text-sm font-bold text-primary tracking-wide uppercase mb-1">
                  {player.class} / {player.subclass}
                </p>
              </div>
              
              <p className="text-on-surface line-clamp-3 flex-grow">{player.description}</p>
              
              <div className="mt-6 flex justify-end">
                <span className="text-primary font-medium text-sm group-hover:underline underline-offset-4 decoration-primary-container decoration-2">
                  View Chronicle →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
