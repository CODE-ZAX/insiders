"use client";

import * as React from "react";
import { Pencil, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserPost } from "@/types/types";
import { updatePost } from "@/services/posts";

interface EditPostModalProps {
  post: UserPost;
  trigger?: React.ReactNode;
  onSubmit?: (payload: {
    caption: string;
    imageUrls: string[];
  }) => Promise<void> | void;
}

export function EditPostModal({ post, trigger, onSubmit }: EditPostModalProps) {
  const [open, setOpen] = React.useState(false);
  const [caption, setCaption] = React.useState(post.caption ?? "");
  const [imageUrls, setImageUrls] = React.useState<string[]>(
    post.image_urls?.length ? [...post.image_urls] : [""]
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [captionError, setCaptionError] = React.useState<string | null>(null);
  const [imageErrors, setImageErrors] = React.useState<(string | null)[]>([]);

  const resetToPostValues = React.useCallback(() => {
    setCaption(post.caption ?? "");
    setImageUrls(post.image_urls?.length ? [...post.image_urls] : [""]);
    setCaptionError(null);
    setImageErrors([]);
    setFormError(null);
  }, [post.caption, post.image_urls]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetToPostValues();
    }
    setOpen(nextOpen);
  };

  React.useEffect(() => {
    if (open) {
      resetToPostValues();
    }
  }, [open, resetToPostValues]);

  const handleImageChange = (index: number, value: string) => {
    setImageUrls((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddImage = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const validate = () => {
    let hasError = false;
    const trimmedCaption = caption.trim();
    const cleanedImages = imageUrls.map((url) => url.trim());
    const nextImageErrors: (string | null)[] = new Array(
      cleanedImages.length
    ).fill(null);

    if (!trimmedCaption) {
      setCaptionError("Caption is required.");
      hasError = true;
    } else {
      setCaptionError(null);
    }

    const filledImages = cleanedImages.filter(Boolean);
    if (filledImages.length === 0) {
      setFormError("A post needs at least one image URL.");
      hasError = true;
    } else {
      setFormError(null);
    }

    cleanedImages.forEach((url, idx) => {
      if (!url) {
        nextImageErrors[idx] = "Image URL cannot be empty.";
        hasError = true;
        return;
      }

      try {
        void new URL(url);
      } catch {
        nextImageErrors[idx] = "Enter a valid URL.";
        hasError = true;
      }
    });

    setImageErrors(nextImageErrors);

    return {
      hasError,
      trimmedCaption,
      cleanedImages,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const { hasError, trimmedCaption, cleanedImages } = validate();
    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        caption: trimmedCaption,
        imageUrls: cleanedImages.filter(Boolean),
      };
      const result = updatePost(post.id, payload);
      handleOpenChange(false);
    } catch (error) {
      console.error("EditPostModal submit error", error);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="ghost" size="sm" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update the caption or images for this post.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor={`post-caption-${post.id}`}
            >
              Caption
            </label>
            <Textarea
              id={`post-caption-${post.id}`}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Tell your audience what this post is about"
              maxLength={280}
              required
            />
            {captionError ? (
              <p className="text-sm text-destructive">{captionError}</p>
            ) : null}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Image URLs</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddImage}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add image
              </Button>
            </div>
            <div className="space-y-3">
              {imageUrls.map((url, idx) => (
                <div
                  key={`post-image-${post.id}-${idx}`}
                  className="flex items-start gap-2"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      value={url}
                      onChange={(event) =>
                        handleImageChange(idx, event.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      type="url"
                      required
                    />
                    {imageErrors[idx] ? (
                      <p className="text-sm text-destructive">
                        {imageErrors[idx]}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(idx)}
                    className="mt-1"
                    aria-label="Remove image"
                    disabled={imageUrls.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}
          </div>
          <DialogFooter className="flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
