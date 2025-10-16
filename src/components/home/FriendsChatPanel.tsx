import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSSRClient } from "@/lib/supabase/server";

const mockFriends = [
  { name: "Alex Morgan", status: "online" },
  { name: "Jordan Smith", status: "away" },
  { name: "Taylor Lee", status: "offline" },
  { name: "Sam Rivera", status: "online" },
  { name: "Jess Carter", status: "online" },
  { name: "Morgan Lee", status: "offline" },
];

export async function FriendsChatPanel() {
  const supabase = await createSSRClient();
  const { error, data } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return (
    <aside className="hidden h-full flex-col gap-6 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm xl:flex">
      <div className="flex h-full flex-col gap-6 overflow-hidden">
        <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
          <div className="border-b border-border/60 p-4">
            <h2 className="text-lg font-semibold text-foreground">Friends</h2>
            <p className="text-sm text-muted-foreground">
              Catch up with your circle
            </p>
            <Input placeholder="Search friends" className="mt-3" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 p-4 pr-2">
            {mockFriends.map((friend) => (
              <div
                key={friend.name}
                className="flex items-center justify-between rounded-2xl bg-background/70 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {friend.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {friend.status}
                  </p>
                </div>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    friend.status === "online"
                      ? "bg-emerald-500"
                      : friend.status === "away"
                      ? "bg-amber-400"
                      : "bg-slate-400"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-[1.1] flex-col overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
          <div className="border-b border-border/60 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Direct Messages
            </h3>
            <Input placeholder="Search conversations" className="mt-3" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-4 text-sm text-muted-foreground">
            <p>Select a friend to start chatting.</p>
            <p className="text-xs">Your conversations will appear here.</p>
          </div>
          <form className="border-t border-border/60 p-4 space-y-3">
            <Textarea placeholder="Send a quick message..." rows={3} />
            <div className="flex justify-end">
              <Button type="button" size="sm">
                Send
              </Button>
            </div>
          </form>
        </section>
      </div>
    </aside>
  );
}
