import locations from "./data.json";

export default function LocationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Gazetteer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-xl -z-10 transition-transform group-hover:scale-[0.98]"></div>
            
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-tertiary">{loc.name}</h2>
              <p className="text-sm font-medium text-outline-variant uppercase tracking-wider">
                {loc.region}
              </p>
            </div>
            
            <p className="text-on-surface">{loc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}