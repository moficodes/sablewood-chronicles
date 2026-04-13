"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Players", href: "/players" },
  { name: "NPCs", href: "/npcs" },
  { name: "Locations", href: "/locations" },
  { name: "Timeline", href: "/timeline" },
];

export function Navbar({ brand = "Sablewood" }: { brand?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-primary font-sans">
              {brand}
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary-container text-on-surface"
                      : "text-on-surface hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface-container-lowest">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-2xl text-base font-medium ${
                  pathname === item.href
                    ? "bg-primary-container text-on-surface"
                    : "text-on-surface hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}