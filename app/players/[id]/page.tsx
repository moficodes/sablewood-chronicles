import { notFound } from "next/navigation";
import Link from "next/link";
import playersData from "@/data/players.json";
import { Player } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return playersData.map((p) => ({
    id: p.id,
  }));
}

export default async function PlayerDetailPage({ params }: PageProps) {
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
        
        <div className="flex flex-col sm:flex-row gap-8 items-start">
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

              <p className="text-lg text-on-surface leading-relaxed">{player.description}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Traits</h2>
          <div className="flex flex-col gap-4">
            {statLabels.map((stat) => (
              <div key={stat.key} className="bg-surface-container rounded-[1.5rem] p-4 flex justify-between items-center">
                <span className="font-bold text-outline-variant tracking-widest">{stat.label}</span>
                <span className="text-2xl font-bold text-primary-dim">
                  {player.stats[stat.key] > 0 ? `+${player.stats[stat.key]}` : player.stats[stat.key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-12">
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
    </div>
  );
}
