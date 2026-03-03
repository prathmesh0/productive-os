import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, Calendar, LayoutDashboard, CheckCircle, ClipboardCheck, Smartphone, Monitor } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Productivity OS",
  description: "All-in-one productivity system",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Productivity OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn(inter.className, "bg-slate-50 min-h-screen text-slate-900")}>
        <main className="max-w-2xl mx-auto pb-24 pt-4 px-4">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 h-16 flex items-center justify-around px-6 z-40 max-w-2xl mx-auto rounded-t-2xl shadow-2xl">
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <Home className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Home</span>
          </Link>
          <Link href="/calendar" className="flex flex-col items-center gap-1 group">
            <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Calendar</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Stats</span>
          </Link>
          <Link href="/review" className="flex flex-col items-center gap-1 group">
            <ClipboardCheck className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter">Review</span>
          </Link>
        </nav>

        {/* SW Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
