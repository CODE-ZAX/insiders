"use client";

import {
  type ComponentType,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { Bell, Settings, UserRound } from "lucide-react";

import { createSPAClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CreatePostModal } from "@/components/CreatePostModal";
import type { User } from "@supabase/supabase-js";

interface UserMeta {
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export function SidebarUserSection() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingPost] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createSPAClient();
        const {
          error,
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(supabaseUser);
      } catch (error) {
        console.error("SidebarUserSection auth error", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const initials = useMemo(() => {
    if (!user) return "";
    const name =
      user.user_metadata?.full_name ||
      user.email ||
      (user.user_metadata as UserMeta | undefined)?.email ||
      "User";
    return name
      .split(" ")
      .map((part: any) => part.trim())
      .filter(Boolean)
      .map((part: any) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  if (loading) {
    return (
      <div className="mt-auto space-y-4 rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        Checking account status...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-auto rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="mb-3 font-medium text-foreground">Join Insiders</p>
        <p className="mb-4 text-xs leading-relaxed">
          Sign in to unlock notifications, settings, and your profile dashboard.
        </p>
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="mt-auto space-y-4 rounded-2xl border border-border/60 bg-muted/40 p-4">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
        )}
        <div className="text-sm">
          <p className="font-semibold text-foreground">
            {user.user_metadata?.full_name || user.email || "Insider"}
          </p>
          <p className="text-xs text-muted-foreground">Welcome back</p>
        </div>
      </div>
      <CreatePostModal
        trigger={
          <Button
            type="button"
            size="sm"
            className="w-full justify-center"
            disabled={creatingPost}
          >
            Create new post
          </Button>
        }
      />
      <div className="grid gap-2">
        <SidebarAuthLink
          href="/notifications"
          icon={Bell}
          label="Notifications"
        />
        <SidebarAuthLink href="/settings" icon={Settings} label="Settings" />
        <SidebarAuthLink
          href={`/profile/${user.id}`}
          icon={UserRound}
          label="Profile"
        />
      </div>
    </div>
  );
}

interface SidebarAuthLinkProps {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

function SidebarAuthLink({ href, label, icon: Icon }: SidebarAuthLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl bg-background/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
