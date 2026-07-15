import { createClient } from "@/lib/supabase/server";

export async function getOrCreateConversation(
  itemId: string,
  sellerId: string
) {
  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  // Prevent messaging yourself
  if (user.id === sellerId) {
    throw new Error("You cannot message yourself.");
  }
  // Check whether a conversation already exists
const { data: existingConversation, error } = await supabase
  .from("conversations")
  .select("id")
  .eq("item_id", itemId)
  .eq("buyer_id", user.id)
  .eq("seller_id", sellerId)
  .maybeSingle();

if (error) {
  throw error;
}

// Conversation already exists
if (existingConversation) {
  return existingConversation.id;
}

// We'll create a new conversation next.
const { data: newConversation, error: createError } = await supabase
  .from("conversations")
  .insert({
    item_id: itemId,
    buyer_id: user.id,
    seller_id: sellerId,
  })
  .select("id")
  .single();

if (createError) {
  throw createError;
}

return newConversation.id;

  
}
