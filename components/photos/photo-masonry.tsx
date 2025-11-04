"use client";

import * as React from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PhotoItem } from "@/types/content";

interface PhotoMasonryProps {
  photos: PhotoItem[];
  tags: string[];
}

export function PhotoMasonry({ photos, tags }: PhotoMasonryProps) {
  const [activeTags, setActiveTags] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const filtered = React.useMemo(() => {
    if (activeTags.length === 0) return photos;
    return photos.filter((photo) =>
      activeTags.every((tag) => photo.tags.includes(tag)),
    );
  }, [photos, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const closeLightbox = React.useCallback(() => setActiveIndex(null), []);

  const showPrev = React.useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + filtered.length) % filtered.length,
    );
  }, [filtered.length]);

  const showNext = React.useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % filtered.length,
    );
  }, [filtered.length]);

  React.useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, showNext, showPrev]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            active={activeTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Chip>
        ))}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((photo, index) => (
          <div
            key={photo.id}
            id={photo.id}
            className="mb-4 break-inside-avoid"
          >
            <button
              type="button"
              className="group relative block overflow-hidden rounded-2xl"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={photo.src}
                alt={photo.caption ?? "Panda Growth 社群照片"}
                width={photo.w}
                height={photo.h}
                className="w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 rounded-xl bg-black/60 p-3 text-left text-xs text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-semibold">{photo.caption ?? "社群瞬间"}</p>
                <p className="mt-1">{photo.tags.join(" / ")}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
      <Lightbox
        photos={filtered}
        index={activeIndex}
        onClose={closeLightbox}
        onPrev={showPrev}
        onNext={showNext}
      />
    </div>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: PhotoItem[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const open = index !== null;
  const current = index !== null ? photos[index] : null;

  return (
    <Dialog.Root open={open} onOpenChange={(state) => !state && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
          {current ? (
            <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-2xl">
              <div className="relative aspect-[16/10] w-full bg-black">
                <Image
                  src={current.src}
                  alt={current.caption ?? "Panda Growth 社群照片"}
                  fill
                  sizes="(min-width: 1280px) 60vw, (min-width: 768px) 80vw, 100vw"
                  className="object-contain"
                />
              </div>
              <ScrollArea className="max-h-48">
                <div className="space-y-3 p-6 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {current.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {current.takenAt ? (
                      <span className="text-xs text-white/60">
                        {current.takenAt}
                      </span>
                    ) : null}
                  </div>
                  {current.caption ? <p>{current.caption}</p> : null}
                </div>
              </ScrollArea>
              <div className="absolute left-4 top-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={onPrev}
                  aria-label="上一张"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={onNext}
                  aria-label="下一张"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    if (current) {
                      const link = document.createElement("a");
                      link.href = current.src;
                      link.download = current.id;
                      link.target = "_blank";
                      link.rel = "noopener noreferrer";
                      link.click();
                    }
                  }}
                  aria-label="下载图片"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={onClose}
                  aria-label="关闭"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
