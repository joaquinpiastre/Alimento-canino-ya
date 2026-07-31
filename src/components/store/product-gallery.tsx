"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : ["https://placedog.net/600/600"];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
        <Image
          src={list[active]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2">
          {list.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2",
                active === i ? "border-primary" : "border-transparent"
              )}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
