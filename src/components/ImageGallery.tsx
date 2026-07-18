"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  videoUrl?: string | null;
};

export default function ImageGallery({
  images,
  videoUrl,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-brand-light shadow-sm">
        {images?.length > 0 ? (
          <Image
            src={images[selectedImage]}
            alt="Product image"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            No photo
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {(images.length > 1 || videoUrl) && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                selectedImage === index
                  ? "border-brand"
                  : "border-border"
              }`}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-white text-sm font-medium text-brand"
            >
              ▶
            </a>
          )}
        </div>
      )}
    </>
  );
}
