import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "feed", label: "Feed", href: "/?tab=feed" },
  { key: "reels", label: "Reels", href: "/?tab=reels" },
  { key: "search", label: "Search", href: "/?tab=search" },
];

interface FeedTabsProps {
  activeTab: string;
}

export function FeedTabs({ activeTab }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-background hover:text-foreground",
            activeTab === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

