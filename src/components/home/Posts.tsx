import { createSSRClient } from "@/lib/supabase/server";
import { UserPost } from "@/types/types";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { DeletePostDialog } from "../DeletePostDialog";
import { EditPostModal } from "../EditPostModal";
import { PostImageCarousel } from "./PostImageCarousel";
import { normalizePost } from "@/services/posts";
export async function fetchRecentPosts(limit = 5): Promise<UserPost[]> {
  const supabase = await createSSRClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizePost);
}
const Posts = async () => {
  const supabase = await createSSRClient();
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData?.user?.id ?? null;

  let posts: UserPost[] = [];

  try {
    posts = await fetchRecentPosts(5);
  } catch (error) {
    console.error("Failed to load posts", error);
    return (
      <div className="text-sm text-destructive">
        We could not load posts right now.
      </div>
    );
  }

  if (!posts?.length) {
    return <div className="text-sm text-muted-foreground">No posts yet.</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post: UserPost) => {
        const createdAt = post.created_at
          ? new Date(post.created_at).toLocaleString()
          : "";
        const isOwner = currentUserId ? post.owner === currentUserId : false;
        const caption = post.caption ?? "";

        return (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-base font-medium">{caption}</p>
                  {createdAt ? (
                    <p className="text-xs text-muted-foreground">{createdAt}</p>
                  ) : null}
                </div>
                {isOwner ? (
                  <div className="flex items-center gap-2">
                    <EditPostModal post={post} />
                    <DeletePostDialog postId={post.id} caption={caption} />
                  </div>
                ) : null}
              </div>
              <PostImageCarousel
                imageUrls={post.image_urls}
                caption={caption}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Posts;
