import Link from "next/link";
import Image from "next/image";
import { getCampaignData } from "@/src/lib/data";

export default function NPCsPage() {
  const { npcs } = getCampaignData();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Notable Figures</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {npcs.map((npc) => (
          <Link href={`/npcs/${npc.id}`} key={npc.id} className="block group">
            <div className="bg-surface-container-low p-6 rounded-[2rem] relative overflow-hidden h-full flex flex-col items-center text-center transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-[1.5rem] -z-10"></div>
              
              {npc.image ? (
                <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden shadow-elevation-2">
                  <Image 
                    src={npc.image} 
                    alt={npc.name} 
                    fill 
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mb-6 rounded-full bg-surface-container-high flex items-center justify-center shadow-elevation-2">
                  <span className="text-4xl text-primary font-bold">{npc.name.charAt(0)}</span>
                </div>
              )}
              
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-secondary group-hover:text-primary transition-colors">{npc.name}</h2>
              </div>
              
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <span className="px-4 py-2 bg-surface-container rounded-[1rem] text-sm font-medium text-on-surface">
                  {npc.role}
                </span>
                <span className="px-4 py-2 bg-surface-container rounded-[1rem] text-sm font-medium text-outline-variant">
                  {npc.location}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}