import Link from "next/link";
import { getCampaignData } from "@/lib/data";
import Image from "next/image";

export default function LocationsPage() {
  const { locations: locationsData } = getCampaignData();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Gazetteer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {locationsData.map((loc) => {
          const featureImage = loc.images && loc.images.length > 0 ? loc.images[0] : null;

          return (
            <Link href={`/locations/${loc.id}`} key={loc.id} className="block group">
              <div className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden transition-transform group-hover:-translate-y-1 h-full flex flex-col">
                <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-xl -z-10 transition-transform group-hover:scale-[0.98]"></div>
                
                {/* Feature Image or Fallback */}
                <div className="w-full h-48 mb-6 rounded-xl overflow-hidden relative bg-surface-container-high flex items-center justify-center shrink-0">
                  {featureImage ? (
                    <Image
                      src={featureImage}
                      alt={loc.name}
                      fill
                      className="object-cover"
                      unoptimized={featureImage.startsWith('http')}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-outline-variant/50">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="mb-4 shrink-0">
                  <h2 className="text-2xl font-bold text-tertiary">{loc.name}</h2>
                  <p className="text-sm font-medium text-outline-variant uppercase tracking-wider">
                    {loc.region}
                  </p>
                </div>
                
                <p className="text-on-surface line-clamp-3 flex-grow">{loc.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}