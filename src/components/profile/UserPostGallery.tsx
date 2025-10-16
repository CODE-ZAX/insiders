"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { PostImageCarousel } from "@/components/home/PostImageCarousel";
import { EditPostModal } from "@/components/EditPostModal";
import { DeletePostDialog } from "@/components/DeletePostDialog";
import { CreatePostModal } from "@/components/CreatePostModal";
import type { UserPost } from "@/types/types";
import { createPost, deletePost, updatePost } from "@/services/posts";

interface UserPostGalleryProps {
  initialPosts: UserPost[];
  isOwner: boolean;
  errorMessage?: string | null;
}

export function UserPostGallery({ initialPosts, isOwner, errorMessage }: UserPostGalleryProps) {
  const [posts, setPosts] = useState<UserPost[]>(initialPosts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async (payload: { caption: string; imageUrls: string[] }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const post = await createPost(payload);
      setPosts((prev) => [post, ...prev]);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (postId: string, payload: { caption: string; imageUrls: string[] }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await updatePost(postId, payload);
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-xl font-semibold text-foreground">Your posts</h2>
            <p className="text-sm text-muted-foreground">Manage your gallery of shared moments.</p>
          </div>
          <CreatePostModal
            onSubmit={handleCreate}
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
          {isOwner ? "You have not created any posts yet. Start sharing to see them here." : "This user has not shared any posts yet."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const caption = post.caption ?? "";
            const createdAt = post.created_at ? new Date(post.created_at).toLocaleString() : "";

            return (
              <Card key={post.id} className="overflow-hidden border border-border/60 bg-card/80">
                <CardContent className="space-y-3 p-4">
                  <PostImageCarousel imageUrls={post.image_urls} caption={caption} />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{caption || "Untitled post"}</p>
                    {createdAt ? (
                      <p className="text-xs text-muted-foreground">Published {createdAt}</p>
                    ) : null}
                  </div>
                  {isOwner ? (
                    <div className="flex items-center gap-2">
                      <EditPostModal post={post} onSubmit={(updated) => handleUpdate(post.id, updated)} />
                      <DeletePostDialog
                        postId={post.id}
                        caption={caption}
                        onConfirm={() => handleDelete(post.id)}
                      />
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
