"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="#" className="relative flex items-center gap-2">
          <motion.span
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-brand-purple/40 via-brand-pink/30 to-brand-cyan/30 text-brand-cyan shadow-neon"
            animate={{
              boxShadow: [
                "0 0 15px rgba(124,58,237,0.45)",
                "0 0 30px rgba(34,211,238,0.55)",
                "0 0 15px rgba(124,58,237,0.45)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.span>
          <span className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-clip-text text-lg font-semibold tracking-[0.2em] text-transparent">
            EKPAD
          </span>
        </Link>

        <NavigationMenu className="hidden items-center gap-3 md:flex">
          <NavigationMenuList>
            {[
              { name: "Features", href: "#features" },
              { name: "Stories", href: "#stories" },
              { name: "Community", href: "#community" }
            ].map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "group inline-flex items-center rounded-full border border-transparent px-5 py-2 text-sm font-medium text-muted-foreground/80 transition-all hover:border-brand-purple/60 hover:bg-brand-purple/15 hover:text-foreground"
                  )}
                >
                  <Link href={item.href}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" className="gap-2 text-sm text-muted-foreground hover:text-foreground">
            <User className="h-4 w-4" />
            Log in
          </Button>
          <Button className="shadow-neon">Join the beta</Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={12} align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="#features">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#stories">Stories</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#community">Community</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="shadow-neon">
            Join beta
          </Button>
        </div>
      </div>
    </header>
  );
}
