import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-surface-container-low p-8 md:p-12 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-[1rem] rounded-bl-[1rem] relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-primary-container rounded-br-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-container rounded-tl-full opacity-50"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Welcome to the Sablewood Chronicles
          </h1>
          <p className="text-lg md:text-xl text-on-surface mb-8 leading-relaxed max-w-3xl">
            A living chronicle of our tabletop adventures. Explore the heroes, the villains, and the world they inhabit.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-surface-container-lowest p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-primary-dim mb-2">Players</h3>
              <p className="text-on-surface mb-4">Discover the brave adventurers shaping the fate of Sablewood.</p>
              <Link href="/players" className="text-secondary font-bold hover:text-secondary-container transition-colors">Meet the Party &rarr;</Link>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-primary-dim mb-2">NPCs</h3>
              <p className="text-on-surface mb-4">Learn about the friends, foes, and bystanders we&apos;ve met along the way.</p>
              <Link href="/npcs" className="text-secondary font-bold hover:text-secondary-container transition-colors">View Characters &rarr;</Link>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-primary-dim mb-2">Locations</h3>
              <p className="text-on-surface mb-4">Explore the towns, dungeons, and wilderness of our world.</p>
              <Link href="/locations" className="text-secondary font-bold hover:text-secondary-container transition-colors">Explore the World &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}