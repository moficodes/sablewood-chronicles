import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampaignData } from "@/lib/data";
import { Player } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { players: playersData } = getCampaignData();
  return playersData.map((p: Player) => ({
    id: p.id,
  }));
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { players: playersData } = getCampaignData();
  const resolvedParams = await params;
  const player = (playersData as Player[]).find((p) => p.id === resolvedParams.id);

  if (!player) {
    notFound();
  }

  const statLabels = [
    { key: "agility", label: "AGI" },
    { key: "strength", label: "STR" },
    { key: "finesse", label: "FIN" },
    { key: "instinct", label: "INS" },
    { key: "presence", label: "PRE" },
    { key: "knowledge", label: "KNO" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/players" 
        className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dim transition-colors mb-8"
      >
        ← Back to Party
      </Link>

      <div className="bg-surface-container-low rounded-[2rem] p-6 sm:p-10 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-surface-container-lowest m-2 sm:m-4 rounded-[1.5rem] -z-10"></div>
        
        <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
           <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 rounded-[2rem] overflow-hidden bg-surface-container-highest shadow-sm">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
           </div>

           <div className="flex-grow">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">{player.name}</h1>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="px-4 py-1.5 bg-tertiary-container text-on-surface rounded-full text-sm font-bold">
                    Tier {player.tier} • Level {player.level}
                 </span>
                 <span className="px-4 py-1.5 bg-secondary-container text-secondary font-bold rounded-full text-sm">
                    {player.ancestry} ({player.community})
                 </span>
                 <span className="px-4 py-1.5 bg-primary-container text-primary font-bold rounded-full text-sm">
                    {player.class} / {player.subclass}
                 </span>
              </div>

              <p className="text-xl text-on-surface leading-relaxed font-medium">{player.description}</p>
           </div>
        </div>

        <div className="bg-surface-container rounded-[1.5rem] p-6 text-on-surface w-full">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Backstory</h3>
          <p className="text-base leading-relaxed">{player.backstory}</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Traits</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {statLabels.map((stat) => (
            <div key={stat.key} className="bg-surface-container rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2">
              <span className="font-bold text-outline-variant tracking-widest">{stat.label}</span>
              <span className="text-3xl font-bold text-primary-dim">
                {player.stats[stat.key] > 0 ? `+${player.stats[stat.key]}` : player.stats[stat.key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {player.backgroundQuestions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Background</h2>
            <div className="space-y-6">
              {player.backgroundQuestions.map((q, i) => (
                <div key={i} className="bg-surface-variant rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-lg rounded-bl-lg p-6 sm:p-8">
                  <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">{q.question}</h3>
                  <p className="text-on-surface font-serif italic text-lg leading-relaxed">&quot;{q.answer}&quot;</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {player.connectionQuestions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Connections</h2>
            <div className="space-y-6">
              {player.connectionQuestions.map((q, i) => (
                <div key={i} className="bg-surface-variant rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-lg rounded-bl-lg p-6 sm:p-8">
                  <h3 className="text-sm font-bold text-tertiary uppercase tracking-wider mb-3">{q.question}</h3>
                  <p className="text-on-surface font-serif italic text-lg leading-relaxed">&quot;{q.answer}&quot;</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
