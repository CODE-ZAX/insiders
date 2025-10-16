import Link from "next/link";
import {
  Compass,
  Film,
  Gamepad2,
  Home,
  Search as SearchIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarUserSection } from "./SidebarUserSection";

const navItems = [
  { label: "Feed", icon: Home, href: "/?tab=feed", tab: "feed" },
  { label: "Search", icon: SearchIcon, href: "/?tab=search", tab: "search" },
  { label: "Reels", icon: Film, href: "/?tab=reels", tab: "reels" },
  { label: "Games", icon: Gamepad2, href: "/games", tab: null },
];

interface SocialSidebarProps {
  activeTab: string;
}

export function SocialSidebar({ activeTab }: SocialSidebarProps) {
  return (
    <aside className="hidden h-full w-60 flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm lg:flex">
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Compass className="h-6 w-6 text-primary" />
          <span>Insiders</span>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.tab ? activeTab === item.tab : false;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <SidebarUserSection />
    </aside>
  );
}
