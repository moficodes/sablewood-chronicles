import players from "./data.json";

export default function PlayersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">The Party</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player) => (
          <div key={player.id} className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden group">
            {/* Background tonal shift */}
            <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-xl -z-10 transition-transform group-hover:scale-[0.98]"></div>
            
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-primary-dim">{player.name}</h2>
              <p className="text-sm font-medium text-outline-variant uppercase tracking-wider">
                Level {player.level} {player.race} {player.class}
              </p>
            </div>
            
            <p className="text-on-surface mb-6">{player.description}</p>
            
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-surface-container p-2 rounded-xl">
                <div className="font-bold text-primary">STR</div>
                <div className="text-on-surface">{player.stats.str}</div>
              </div>
              <div className="bg-surface-container p-2 rounded-xl">
                <div className="font-bold text-primary">DEX</div>
                <div className="text-on-surface">{player.stats.dex}</div>
              </div>
              <div className="bg-surface-container p-2 rounded-xl">
                <div className="font-bold text-primary">CON</div>
                <div className="text-on-surface">{player.stats.con}</div>
              </div>
              <div className="bg-surface-container p-2 rounded-xl">
                <div className="font-bold text-primary">INT</div>
                <div className="text-on-surface">{player.stats.int}</div>
              </div>
              <div className="bg-surface-container p-2 rounded-xl">
                <div className="font-bold text-primary">WIS</div>
                <div className="text-on-surface">{player.stats.wis}</div>
              </div>
              <div className="bg-surface-container p-2 rounded-xl">
                <div className="font-bold text-primary">CHA</div>
                <div className="text-on-surface">{player.stats.cha}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}