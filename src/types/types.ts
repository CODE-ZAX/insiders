export interface UserPost {
  id: string;
  image_urls: string[];
  caption: string | null;
  created_at: string;
  updated_at: string | null;
  owner: string | null;
}
