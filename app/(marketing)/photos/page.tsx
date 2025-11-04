import type { Metadata } from "next";

import { Section } from "@/components/section";
import { PhotoMasonry } from "@/components/photos/photo-masonry";
import { Badge } from "@/components/ui/badge";
import { getPhotos } from "@/lib/content";

export const metadata: Metadata = {
  title: "社群照片墙",
  description: "Panda Growth 的线下活动、线上里程碑与成员风采，真实呈现我们的学习节奏。",
};

export default async function PhotosPage() {
  const photoItems = await getPhotos();
  const tags = Array.from(new Set(photoItems.flatMap((photo) => photo.tags)));

  return (
    <div className="w-full space-y-16 pb-24">
      <Section outerClassName="bg-muted/25" className="space-y-5">
        <Badge variant="brand">Community Moments</Badge>
        <h1 className="text-4xl font-bold text-foreground">社群照片墙</h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          线下写作营、线上里程碑、成员合影与获奖瞬间。我们相信真实的连接能让增长更可持续，一起来看看 Panda Growth 的日常。
        </p>
      </Section>
      <Section outerClassName="py-0" className="pt-0">
        <PhotoMasonry photos={photoItems} tags={tags} />
      </Section>
    </div>
  );
}
