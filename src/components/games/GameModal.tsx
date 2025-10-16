"use client";

import * as React from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function GameModal({
  open,
  onClose,
  title,
  description,
  children,
}: GameModalProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl border border-border/60 bg-card/95 p-0 shadow-xl sm:max-w-4xl">
        <div className="relative flex flex-col overflow-hidden rounded-xl">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 bg-muted/40 px-6 py-4">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-semibold text-foreground">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close game"
              className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden bg-background/90 p-6">
            <div className="h-full flex justify-center  w-full overflow-auto rounded-lg border border-border/60 bg-background p-4">
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
