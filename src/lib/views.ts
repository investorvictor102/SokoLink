import { createClient } from "@/lib/supabase/server";

export async function incrementViewIfNeeded(
  itemId: string,
  sellerId: string,
  userId: string | null
) {
  // Don't count the seller viewing their own listing
  if (userId && userId === sellerId) {
    return false;
  }

  const supabase = createClient();

  const { error } = await supabase.rpc("increment_item_views", {
    item_id: itemId,
  });

  if (error) {
    throw error;
  }

  return true;
}
