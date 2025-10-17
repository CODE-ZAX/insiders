"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { PostImageCarousel } from "@/components/home/PostImageCarousel";
import { EditPostModal } from "@/components/EditPostModal";
import { DeletePostDialog } from "@/components/DeletePostDialog";
import { CreatePostModal } from "@/components/CreatePostModal";
import type { UserPost } from "@/types/types";

interface UserPostGalleryProps {
  initialPosts: UserPost[];
  isOwner: boolean;
  errorMessage?: string | null;
}

export function UserPostGallery({
  initialPosts,
  isOwner,
  errorMessage,
}: UserPostGalleryProps) {
  const [posts] = useState<UserPost[]>(initialPosts);
  const [isSubmitting] = useState(false);

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}
      {isOwner ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Your posts
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your gallery of shared moments.
            </p>
          </div>
          <CreatePostModal
            trigger={
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                disabled={isSubmitting}
              >
                Create new post
              </button>
            }
          />
        </div>
      ) : null}
      {!posts.length ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/40 p-10 text-center text-sm text-muted-foreground">
          {isOwner
            ? "You have not created any posts yet. Start sharing to see them here."
            : "This user has not shared any posts yet."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const caption = post.caption ?? "";
            const createdAt = post.created_at
              ? new Date(post.created_at).toLocaleString()
              : "";

            return (
              <Card
                key={post.id}
                className="overflow-hidden border border-border/60 bg-card/80"
              >
                <CardContent className="space-y-3 p-4">
                  <PostImageCarousel
                    imageUrls={post.image_urls}
                    caption={caption}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {caption || "Untitled post"}
                    </p>
                    {createdAt ? (
                      <p className="text-xs text-muted-foreground">
                        Published {createdAt}
                      </p>
                    ) : null}
                  </div>
                  {isOwner ? (
                    <div className="flex items-center gap-2">
                      <EditPostModal post={post} />
                      <DeletePostDialog postId={post.id} caption={caption} />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
