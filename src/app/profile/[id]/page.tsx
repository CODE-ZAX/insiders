import { redirect } from "next/navigation";

import { createSSRClient } from "@/lib/supabase/server";
import { fetchUserPosts } from "@/services/posts";
import { UserPostGallery } from "@/components/profile/UserPostGallery";
import type { UserPost } from "@/types/types";
import LogoutButton from "@/components/profile/LogoutButton";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createSSRClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Failed to resolve session for profile", authError);
  }

  if (!user) {
    redirect("/auth/login");
  }

  const profileId = (await params).id;

  let posts: UserPost[] = [];
  let loadError: string | null = null;

  try {
    posts = await fetchUserPosts(profileId);
  } catch (error) {
    console.error("Failed to fetch user posts", error);
    loadError = "We could not load posts right now. Please try again.";
  }

  const isOwner = user.id === profileId;
  const displayName = isOwner
    ? user.user_metadata?.full_name || user.email || "Insider"
    : "this user";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 lg:px-8">
        <header className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                {isOwner ? "Your profile" : "Profile"}
              </h1>
              <p className="text-muted-foreground">
                {isOwner
                  ? "Curate your presence across Insiders."
                  : `Exploring posts from ${displayName}.`}
              </p>
            </div>
            {isOwner ? <LogoutButton /> : null}
          </div>
        </header>
        <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm">
          <UserPostGallery
            initialPosts={posts}
            isOwner={isOwner}
            errorMessage={loadError}
          />
        </section>
      </div>
    </div>
  );
}
