"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteItemButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-[13px] font-medium text-brick hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-[13px]">
      <span className="text-muted">Delete this listing?</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="font-medium text-brick hover:underline"
      >
        {loading ? "Deleting..." : "Yes, delete"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-muted hover:underline"
      >
        Cancel
      </button>
    </span>
  );
}
