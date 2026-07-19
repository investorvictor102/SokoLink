"use client";

import imageCompression from "browser-image-compression";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";

import {
  KENYA_REGIONS,
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/utils";

export default function PostItemPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImagesChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setError(null);

    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    if (images.length + files.length > MAX_IMAGES) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} photos.`
      );
      return;
    }

    const oversized = files.find(
      (file) => file.size > MAX_IMAGE_BYTES
    );

    if (oversized) {
      setError(
        `${oversized.name} is over 5MB. Choose a smaller image.`
      );
      return;
    }

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    };

    try {
      const compressed = await Promise.all(
        files.map((file) =>
          imageCompression(file, options)
        )
      );

      setImages((prev) => [...prev, ...compressed]);

      e.target.value = "";
    } catch {
      setError("Failed to compress image.");
    }
  }

  function handleVideoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setError(null);

    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_VIDEO_BYTES) {
      setError("Video must be 1MB or smaller.");
      e.target.value = "";
      return;
    }

    setVideo(file);
  }

  function removeImage(index: number) {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function removeVideo() {
    setVideo(null);
  }
    async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError(null);

    if (!name.trim()) {
      setError("Enter an item name.");
      return;
    }

    if (!category) {
      setError("Select a category.");
      return;
    }

    if (!region) {
      setError("Select a region.");
      return;
    }

    if (images.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    const priceValue = Number(price.replace(/,/g, ""));

    if (!priceValue || priceValue <= 0) {
      setError("Enter a valid price.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "You must be logged in to post an item."
        );
      }

      const imageUrls: string[] = [];

      for (const file of images) {
        const path = `${user.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } =
          await supabase.storage
            .from("item-images")
            .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("item-images")
          .getPublicUrl(path);

        imageUrls.push(data.publicUrl);
      }

      let videoUrl: string | null = null;

      if (video) {
        const path = `${user.id}/${Date.now()}-${video.name}`;

        const { error: uploadError } =
          await supabase.storage
            .from("item-videos")
            .upload(path, video);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("item-videos")
          .getPublicUrl(path);

        videoUrl = data.publicUrl;
      }

      const { data: inserted, error: insertError } =
        await supabase
          .from("items")
          .insert({
            seller_id: user.id,
            name,
            category,
            price_kes: priceValue,
            description,
            region,
            image_urls: imageUrls,
            video_url: videoUrl,
          })
          .select("id")
          .single();

      if (insertError) throw insertError;

      router.push(`/items/${inserted.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }
    return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-[22px] font-bold text-ink">
        Post an Item
      </h1>

      <p className="mt-1 text-[14px] text-muted">
        Buyers will see this listing and can contact you directly.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        <div>
          <label className="label">Item Name</label>

          <input
            required
            className="input-field"
            placeholder="e.g. Samsung Galaxy S23"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Category</label>

          <select
            required
            className="input-field"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              Select category
            </option>

            {CATEGORIES.map((cat) => (
              <option
                key={cat.name}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            Price (KES)
          </label>

          <input
            required
            inputMode="numeric"
            className="input-field"
            placeholder="45000"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />
        </div>

        <div>
          <label className="label">
            Description
          </label>

          <textarea
            required
            rows={5}
            className="input-field resize-y"
            placeholder="Describe the item, condition, accessories, warranty..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div>
          <label className="label">Region</label>

          <select
            required
            className="input-field"
            value={region}
            onChange={(e) =>
              setRegion(e.target.value)
            }
          >
            <option value="">
              Select region
            </option>

            {KENYA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            Photos ({images.length}/{MAX_IMAGES})
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="input-field"
          />

          <p className="mt-1 text-xs text-muted">
            Images are automatically compressed
            before upload for faster posting.
          </p>
        </div>

        <div>
          <label className="label">
            Product Video (Optional)
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="input-field"
          />

          <p className="mt-1 text-xs text-muted">
            Maximum 1MB (recommended 5–10
            seconds).
          </p>
        </div>
                {images.length > 0 && (
          <div>
            <label className="label">Photo Preview</label>

            <div className="mt-2 grid grid-cols-3 gap-3">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {video && (
          <div className="rounded-lg border border-border bg-paper p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">
                  Selected Video
                </p>

                <p className="text-sm text-muted truncate">
                  {video.name}
                </p>
              </div>

              <button
                type="button"
                onClick={removeVideo}
                className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Posting Item..." : "Post Item"}
        </button>
      </form>
    </div>
  );
}
