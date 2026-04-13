import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/navbar";
import { getCampaignData } from "@/lib/data";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const data = getCampaignData();
  const header = (data.home as any).header;
  return {
    title: header?.title || "Sablewood Chronicles",
    description: header?.description || "A Living Chronicle",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = getCampaignData();
  const navBrand = (data.home as any).header?.navBrand || "Sablewood";

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar brand={navBrand} />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
