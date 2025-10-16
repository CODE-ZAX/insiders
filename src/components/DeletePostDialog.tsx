"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/services/posts";

interface DeletePostDialogProps {
  postId: string;
  caption?: string | null;
  trigger?: React.ReactNode;
  onConfirm?: (postId: string) => Promise<void> | void;
}

export function DeletePostDialog({
  postId,
  caption,
  trigger,
  onConfirm,
}: DeletePostDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrorMessage(null);
    }
    setOpen(nextOpen);
  };

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deletePost(postId);
      setOpen(false);
    } catch (error) {
      console.error("DeletePostDialog confirm error", error);
      setErrorMessage("We could not delete this post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
            {caption ? ` You are about to remove "${caption}".` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete post"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
