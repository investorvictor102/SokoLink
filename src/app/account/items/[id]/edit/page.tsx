"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  KENYA_REGIONS,
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/utils";

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loadingItem, setLoadingItem] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");

  // Existing media already on the item, kept as URLs.
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);

  // Newly added media for this edit, as Files.
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideo, setNewVideo] = useState<File | null>(null);
  const [removeVideo, setRemoveVideo] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: item } = await supabase
        .from("items")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!item || !user || item.seller_id !== user.id) {
        setNotFound(true);
        setLoadingItem(false);
        return;
      }

      setName(item.name);
      setPrice(String(item.price_kes));
      setDescription(item.description);
      setRegion(item.region);
      setExistingImages(item.image_urls ?? []);
      setExistingVideo(item.video_url);
      setLoadingItem(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const totalImageCount = existingImages.length + newImages.length;

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = Array.from(e.target.files ?? []);

    if (totalImageCount + files.length > MAX_IMAGES) {
      setError(`You can have a maximum of ${MAX_IMAGES} photos.`);
      return;
    }
    const oversized = files.find((f) => f.size > MAX_IMAGE_BYTES);
    if (oversized) {
      setError(`${oversized.name} is over 5MB. Choose a smaller image.`);
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
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
    setRemoveVideo(false);
    setNewVideo(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!region) {
      setError("Select a region.");
      return;
    }
    if (totalImageCount === 0) {
      setError("Keep at least one photo.");
      return;
    }

    const priceValue = Number(price.replace(/,/g, ""));
    if (!priceValue || priceValue <= 0) {
      setError("Enter a valid price in KES.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in.");
      setSaving(false);
      return;
    }

    try {
      const imageUrls: string[] = [...existingImages];
      for (const file of newImages) {
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

      let videoUrl: string | null = removeVideo ? null : existingVideo;
      if (newVideo) {
        const path = `${user.id}/${Date.now()}-${newVideo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("item-videos")
          .upload(path, newVideo);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("item-videos")
          .getPublicUrl(path);
        videoUrl = publicUrl.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("items")
        .update({
          name,
          price_kes: priceValue,
          description,
          region,
          image_urls: imageUrls,
          video_url: videoUrl,
        })
        .eq("id", params.id);

      if (updateError) throw updateError;

      router.push(`/items/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingItem) {
    return <p className="text-[14px] text-muted">Loading...</p>;
  }

  if (notFound) {
    return (
      <p className="text-[14px] text-brick">
        That listing doesn&apos;t exist, or you don&apos;t have permission to
        edit it.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-[22px] font-bold text-ink">
        Edit listing
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">Item name</label>
          <input
            required
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            Photos ({totalImageCount}/{MAX_IMAGES})
          </label>
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((url) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-[6px] border border-border"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-[11px] text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
            {newImages.map((file, i) => (
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
                  onClick={() =>
                    setNewImages((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-[11px] text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
            {totalImageCount < MAX_IMAGES && (
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
          {newVideo ? (
            <div className="flex items-center justify-between rounded-[6px] border border-border bg-white px-3 py-2 text-[13px]">
              <span className="truncate text-ink">{newVideo.name}</span>
              <button
                type="button"
                onClick={() => setNewVideo(null)}
                className="ml-3 text-muted hover:text-brick"
              >
                Remove
              </button>
            </div>
          ) : existingVideo && !removeVideo ? (
            <div className="flex items-center justify-between rounded-[6px] border border-border bg-white px-3 py-2 text-[13px]">
              <a
                href={existingVideo}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline"
              >
                Current video
              </a>
              <button
                type="button"
                onClick={() => setRemoveVideo(true)}
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

        <button disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
