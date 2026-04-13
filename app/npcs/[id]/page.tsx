import Link from "next/link";
import Image from "next/image";
import { getCampaignData } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const { npcs } = getCampaignData();
  if (!npcs || npcs.length === 0) {
    return [{ id: "_empty_" }];
  }
  return npcs.map((npc) => ({
    id: npc.id,
  }));
}

export default async function NPCDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { npcs } = getCampaignData();
  const { id } = await params;
  const npc = npcs.find((n) => n.id === id);

  if (!npc) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/npcs"
        className="inline-flex items-center text-primary hover:text-secondary mb-8 transition-colors font-medium bg-surface-container py-2 px-4 rounded-[1rem]"
      >
        <span className="mr-2">&larr;</span> Back to Notable Figures
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Card */}
        <div className="md:col-span-1">
          <div className="bg-surface-container-low p-6 rounded-[2rem] relative overflow-hidden flex flex-col items-center text-center h-full">
            <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-[1.5rem] -z-10"></div>
            
            {npc.image ? (
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden shadow-elevation-3">
                <Image 
                  src={npc.image} 
                  alt={npc.name} 
                  fill 
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            ) : (
              <div className="w-48 h-48 mb-6 rounded-full bg-surface-container-high flex items-center justify-center shadow-elevation-3">
                <span className="text-6xl text-primary font-bold">{npc.name.charAt(0)}</span>
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-primary mb-2">{npc.name}</h1>
            
            <div className="w-full flex flex-col gap-3 mt-4">
              <div className="bg-surface-container py-3 px-4 rounded-[1rem]">
                <p className="text-xs text-outline-variant uppercase tracking-widest mb-1">Role</p>
                <p className="font-medium text-secondary">{npc.role}</p>
              </div>
              <div className="bg-surface-container py-3 px-4 rounded-[1rem]">
                <p className="text-xs text-outline-variant uppercase tracking-widest mb-1">Location</p>
                <p className="font-medium text-secondary">{npc.location}</p>
              </div>
              {npc.attitudeTowardParty && (
                <div className="bg-surface-container py-3 px-4 rounded-[1rem]">
                  <p className="text-xs text-outline-variant uppercase tracking-widest mb-1">Attitude Toward Party</p>
                  <p className="font-medium text-secondary">{npc.attitudeTowardParty}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="bg-surface-container-low p-8 rounded-[2rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-[1.5rem] -z-10"></div>
            <h2 className="text-2xl font-bold text-secondary mb-4">About</h2>
            <p className="text-on-surface leading-relaxed text-lg">
              {npc.description}
            </p>
          </div>

          {npc.memorableInteractions && npc.memorableInteractions.length > 0 && (
            <div className="bg-surface-container-low p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-[1.5rem] -z-10"></div>
              <h2 className="text-2xl font-bold text-secondary mb-6">Memorable Interactions</h2>
              
              <div className="flex flex-col gap-4">
                {npc.memorableInteractions.map((interaction, index) => (
                  <div key={index} className="bg-surface-container p-6 rounded-[1.5rem]">
                    {interaction.highlight && (
                      <h3 className="text-lg font-bold text-primary mb-2">{interaction.highlight}</h3>
                    )}
                    <p className="text-on-surface mb-3">{interaction.description}</p>
                    {interaction.pcInvolved && (
                      <div className="inline-flex items-center px-3 py-1 bg-surface-container-high rounded-full text-sm font-medium text-secondary">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                        PC Involved: {interaction.pcInvolved}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}