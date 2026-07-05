"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);

    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} photos.`);
      return;
    }

    const oversized = files.find((f) => f.size > MAX_IMAGE_BYTES);
    if (oversized) {
      setError(`${oversized.name} is over 5MB. Choose a smaller image.`);
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_BYTES) {
      setError("Video must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setVideo(file);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
      setError("Enter a valid price in KES.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in to post an item.");
      setLoading(false);
      return;
    }

    try {
      const imageUrls: string[] = [];
      for (const file of images) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("item-images")
          .getPublicUrl(path);
        imageUrls.push(publicUrl.publicUrl);
      }

      let videoUrl: string | null = null;
      if (video) {
        const path = `${user.id}/${Date.now()}-${video.name}`;
        const { error: uploadError } = await supabase.storage
          .from("item-videos")
          .upload(path, video);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("item-videos")
          .getPublicUrl(path);
        videoUrl = publicUrl.publicUrl;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("items")
        .insert({
          seller_id: user.id,
          name,
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
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-[22px] font-bold text-ink">
        Post an item
      </h1>
      <p className="mt-1 text-[14px] text-muted">
        Buyers will see this listing and can reach you directly.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">Item name</label>
          <input
            required
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Samsung 55 inch smart TV"
          />
        </div>

        <div>
          <label className="label">Price (KES)</label>
          <input
            required
            inputMode="numeric"
            className="input-field"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="42000"
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            required
            rows={4}
            className="input-field resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, age, reason for selling, anything a buyer should know"
          />
        </div>

        <div>
          <label className="label">Region</label>
          <select
            required
            className="input-field"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select region</option>
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
          <div className="grid grid-cols-3 gap-2">
            {images.map((file, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-[6px] border border-border"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-[11px] text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-[6px] border border-dashed border-border text-[13px] text-muted hover:border-brand">
                Add photo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="label">Video (optional, max 5MB)</label>
          {video ? (
            <div className="flex items-center justify-between rounded-[6px] border border-border bg-white px-3 py-2 text-[13px]">
              <span className="truncate text-ink">{video.name}</span>
              <button
                type="button"
                onClick={() => setVideo(null)}
                className="ml-3 text-muted hover:text-brick"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center rounded-[6px] border border-dashed border-border py-3 text-[13px] text-muted hover:border-brand">
              Upload a short clip (max 5MB)
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>
          )}
        </div>

        {error && <p className="text-[13px] text-brick">{error}</p>}

        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
