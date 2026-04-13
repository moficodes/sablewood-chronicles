import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#fff8f0] text-[#3e3101] flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
