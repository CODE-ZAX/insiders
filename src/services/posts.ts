import type { UserPost } from "@/types/types";
import { createSPAClient } from "@/lib/supabase/client";

interface PostPayload {
  caption: string;
  imageUrls: string[];
}

export function normalizePost(row: any): UserPost {
  return {
    id: String(row.id),
    caption: row.caption,
    created_at: row.created_at,
    updated_at: row.updated_at,
    owner: row.owner,
    image_urls: row.image_urls ?? [],
  };
}

export async function fetchUserPosts(userId: string): Promise<UserPost[]> {
  const supabase = createSPAClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("owner", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizePost);
}

export async function createPost(payload: PostPayload): Promise<UserPost> {
  const supabase = createSPAClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("You need to be signed in to create a post.");
  }

  const { data, error } = await supabase
    .from("posts")
    //@ts-expect-error Since it is not definded in the types
    .insert({
      caption: payload.caption,
      image_urls: payload.imageUrls,
      owner: user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return normalizePost(data);
}

export async function updatePost(
  postId: string,
  payload: PostPayload
): Promise<UserPost> {
  const supabase = createSPAClient();

  const { data, error } = await supabase
    .from("posts")
    //@ts-expect-error Since it is not definded in the types
    .update({
      caption: payload.caption,
      image_urls: payload.imageUrls,
    })
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return normalizePost(data);
}

export async function deletePost(postId: string): Promise<void> {
  const supabase = createSPAClient();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw error;
  }
}
