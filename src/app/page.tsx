import { FeedTabs } from "@/components/home/FeedTabs";
import Posts from "@/components/home/Posts";
import { FriendsChatPanel } from "@/components/home/FriendsChatPanel";
import { SocialSidebar } from "@/components/layout/SocialSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TabKey = "feed" | "reels" | "search";

interface HomePageProps {
  searchParams?: Promise<{
    tab?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const tab = normalizeTab((await searchParams)?.tab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="mx-auto grid  gap-6 px-4 py-10 lg:h-[calc(100vh-3rem)] lg:grid-cols-[260px_minmax(0,1fr)_320px] lg:items-stretch lg:px-8 lg:py-6 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
        <SocialSidebar activeTab={tab} />
        <main className="space-y-6 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm lg:flex lg:h-full lg:flex-col lg:gap-6 lg:space-y-0 lg:overflow-hidden">
          <header className="space-y-3 lg:shrink-0">
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Stay on top of the latest from your network, explore reels, or
              search for new voices.
            </p>
            <FeedTabs activeTab={tab} />
          </header>
          <section className="rounded-2xl bg-background/80 p-4 lg:flex-1 lg:overflow-y-auto">
            {tab === "feed" && <Posts />}
            {tab === "reels" && <ReelsPlaceholder />}
            {tab === "search" && <SearchPlaceholder />}
          </section>
        </main>
        <FriendsChatPanel />
      </div>
    </div>
  );
}

function normalizeTab(tab?: string): TabKey {
  if (tab === "reels" || tab === "search") {
    return tab;
  }
  return "feed";
}

function ReelsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/60 bg-muted/40 p-10 text-center">
      <p className="text-lg font-semibold text-foreground">
        Reels are on the way
      </p>
      <p className="text-sm text-muted-foreground max-w-sm">
        We are putting the final touches on short-form reels. Soon you will be
        able to swipe through immersive stories from creators you follow.
      </p>
      <Button variant="outline" size="sm">
        Notify me
      </Button>
    </div>
  );
}

function SearchPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-muted/40 p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Search the community
        </h2>
        <p className="text-sm text-muted-foreground">
          Find posts, reels, and profiles by keywords or hashtags. Advanced
          filters are coming soon.
        </p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Try #product-launch" className="flex-1" />
          <Button type="button" size="sm">
            Search
          </Button>
        </form>
      </div>
      <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Recent searches</p>
        <p className="mt-2">Your recently explored topics will appear here.</p>
      </div>
    </div>
  );
}
