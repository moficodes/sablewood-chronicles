import { notFound } from "next/navigation";
import Link from "next/link";
import { getCampaignData } from "@/lib/data";
import ImageCarousel from "./ImageCarousel";

export async function generateStaticParams() {
  const { locations: locationsData } = getCampaignData();
  return locationsData.map((loc) => ({
    id: loc.id,
  }));
}

export default async function LocationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { locations: locationsData } = getCampaignData();
  const { id } = await params;
  const location = locationsData.find((loc) => loc.id === id);

  if (!location) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/locations" className="inline-flex items-center text-outline-variant hover:text-primary transition-colors mb-8 group">
        <svg className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Gazetteer
      </Link>

      {/* Hero Section */}
      <div className="mb-12">
        <ImageCarousel images={location.images || []} name={location.name} />
      </div>

      {/* Header Info */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-tertiary mb-2">{location.name}</h1>
        <p className="text-lg md:text-xl font-medium text-outline-variant tracking-wider uppercase">
          {location.region}
        </p>
      </div>

      {/* Core Details Card */}
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-3xl -z-10"></div>
        <div className="bg-surface-container-low p-8 md:p-12 rounded-3xl">
          <h2 className="text-2xl font-bold text-on-surface mb-6 font-display">About this Location</h2>
          <p className="text-lg text-on-surface leading-relaxed">
            {location.description}
          </p>
        </div>
      </div>

      {/* Memorable Interactions */}
      {location.memorableInteractions && location.memorableInteractions.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-primary mb-8 font-display">Memorable Interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {location.memorableInteractions.map((interaction, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-2xl -z-10 transition-transform group-hover:scale-[0.98]"></div>
                <div className="bg-surface-container-low p-6 rounded-2xl h-full flex flex-col">
                  <div className="mb-4 flex-grow">
                    <p className="text-on-surface text-lg mb-4">{interaction.description}</p>
                    {interaction.highlight && (
                      <div className="bg-secondary-container/30 p-4 rounded-xl">
                        <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-1">Highlight</p>
                        <p className="text-on-surface italic">{interaction.highlight}</p>
                      </div>
                    )}
                  </div>
                  
                  {interaction.pcsInvolved && interaction.pcsInvolved.length > 0 && (
                    <div className="mt-4 pt-4 relative">
                      {/* Fake divider using a subtle background block instead of border */}
                      <div className="absolute top-0 left-0 right-0 h-4 -mx-6 bg-gradient-to-b from-surface-container/50 to-transparent"></div>
                      
                      <div className="flex flex-wrap gap-2 relative z-10">
                        {interaction.pcsInvolved.map((pc) => (
                          <span key={pc} className="bg-tertiary-container text-on-surface px-3 py-1 rounded-full text-sm font-medium">
                            {pc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}