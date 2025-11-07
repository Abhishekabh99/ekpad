import type { Metadata } from "next";

import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: "Ekpad — one pad for every gamer’s story.",
  description:
    "Craft, share, and relive your gaming sagas with Ekpad. Organize highlights, collaborate with your squad, and unlock a neon future for storytellers in play."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", inter.variable, chakra.variable)}
    >
      <body className="relative min-h-screen bg-background text-foreground">
        <span className="pointer-events-none fixed inset-0 z-[-1] bg-gradient-radial opacity-60" />
        <div className="pointer-events-none fixed inset-x-0 top-[-20rem] z-[-1] h-[40rem] bg-gradient-aurora blur-3xl" />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 bg-background/60 py-10">
            <div className="container flex flex-col items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground/60 md:flex-row md:justify-between">
              <span>© {new Date().getFullYear()} Ekpad. Built for storytellers.</span>
              <span className="flex items-center gap-3 text-muted-foreground/70">
                <span>Contact</span>
                <span>Privacy</span>
                <span>Discord</span>
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
