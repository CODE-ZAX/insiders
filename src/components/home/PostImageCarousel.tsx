"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PostImageCarouselProps {
  imageUrls: string[];
  caption?: string;
}

export function PostImageCarousel({
  imageUrls,
  caption,
}: PostImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const total = imageUrls?.length ?? 0;

  React.useEffect(() => {
    if (!total) return;
    if (currentIndex > total - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, total]);

  const showControls = total > 1;

  if (!total) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-square w-full md:aspect-[4/3]">
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {imageUrls.map((url, idx) => (
              <div className="relative h-full w-full shrink-0" key={`${url}-${idx}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={caption ? `${caption} (${idx + 1}/${total})` : `Post image ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {showControls ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 shadow-md hover:bg-background focus-visible:outline-none"
            aria-label="Previous image"
          >
            <span aria-hidden className="text-lg leading-none">
              &#8592;
            </span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 shadow-md hover:bg-background focus-visible:outline-none"
            aria-label="Next image"
          >
            <span aria-hidden className="text-lg leading-none">
              &#8594;
            </span>
          </Button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {imageUrls.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-2 w-2 rounded-full border border-background/70 bg-background/50 transition-all",
                  idx === currentIndex && "h-2 w-6 bg-primary"
                )}
                aria-label={`Show image ${idx + 1}`}
                aria-pressed={idx === currentIndex}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

