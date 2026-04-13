import Link from 'next/link';

export default function Sidebar() {
  const links = [
    { name: 'Home Data', path: '/' },
    { name: 'Players', path: '/players' },
    { name: 'NPCs', path: '/npcs' },
    { name: 'Locations', path: '/locations' },
    { name: 'Timeline', path: '/timeline' },
  ];

  return (
    <div className="w-64 bg-[#fff3d5] h-screen fixed left-0 top-0 overflow-y-auto text-[#3e3101]">
      <div className="p-8 pb-6 font-bold text-lg">
        Campaign Admin
      </div>
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            className="block px-4 py-3 rounded-2xl hover:bg-[#ffedba] transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
