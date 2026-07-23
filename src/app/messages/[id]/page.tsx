import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConversationPanel from "@/components/messages/ConversationPanel";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      id,
      buyer_id,
      seller_id,
      items (
        id,
        name,
        price_kes,
        image_urls
      )
    `)
    .eq("id", params.id)
    .single();

  if (!conversation) notFound();

  if (
    user.id !== conversation.buyer_id &&
    user.id !== conversation.seller_id
  ) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", params.id)
    .order("created_at", { ascending: true });

  const item = Array.isArray(conversation.items)
    ? conversation.items[0]
    : conversation.items;

  // No outer max-w-3xl/card wrapper here anymore — messages/layout.tsx
  // already provides the fixed-height frame. This panel just needs to
  // fill it (h-full) so its own scroll region can be bounded correctly.
  return (
    <ConversationPanel
      item={item}
      messages={messages ?? []}
      currentUserId={user.id}
      conversationId={conversation.id}
    />
  );
}
