"use client";
import { useState, useEffect } from "react";
import { createSPASassClient } from "@/lib/supabase/client";
import { Bell, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CreatePostModal } from "./CreatePostModal";
import { User } from "@supabase/supabase-js";
import { createPost } from "@/services/posts";

export default function AuthAwareButtons() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await createSPASassClient();
        const {
          data: { user },
        } = await supabase.getSupabaseClient().auth.getUser();
        setIsAuthenticated(!!user);
        setUser(user);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleCreate = async (payload: { caption: string; imageUrls: string[] }) => {
    if (creating) return;
    setCreating(true);
    try {
      await createPost(payload);
      router.refresh();
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return null;
  }

  // Navigation buttons for the header

  return isAuthenticated ? (
    <div className="flex items-center gap-1">
      <CreatePostModal
        onSubmit={handleCreate}
        trigger={
          <Button
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors gap-2"
            disabled={creating}
          >
            Create New Post
            <Plus className="h-5 w-5" />
          </Button>
        }
      />
      <Link
        href="/app"
        className="flex justify-center items-center  text-primary w-10 h-10 rounded-full hover:bg-slate-200 transition-colors"
      >
        <Bell className="h-5 w-5" />
      </Link>
      <Link
        href="/app"
        className="flex justify-center items-center  text-primary w-10 h-10 rounded-full hover:bg-slate-200 transition-colors"
      >
        <Settings className="h-5 w-5" />
      </Link>
      <Link
        href="/app"
        className="bg-primary-600 flex justify-center items-center  text-white w-10 h-10 rounded-full hover:bg-primary-700 transition-colors"
      >
        {currentUser?.email ? currentUser?.email[0] : "U"}
      </Link>
    </div>
  ) : (
    <>
      <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
        Login
      </Link>
      <Link
        href="/auth/register"
        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Get Started
      </Link>
    </>
  );
}
