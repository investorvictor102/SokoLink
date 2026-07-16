import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatInput from "@/components/ChatInput";
import LiveChat from "@/components/LiveChat";

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
        name
      )
    `)
    .eq("id", params.id)
    .single();
    
    const { data: messages } = await supabase
  .from("messages")
  .select("*")
  .eq("conversation_id", params.id)
  .order("created_at", { ascending: true });

  if (!conversation) notFound();

  // Only buyer or seller can open the conversation
  if (
    user.id !== conversation.buyer_id &&
    user.id !== conversation.seller_id
  ) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-card border border-border bg-white p-6">
        <h1 className="text-2xl font-bold">
  {conversation.items?.[0]?.name ?? "Conversation"}
</h1>

        <p className="mt-2 text-muted">
          Conversation
        </p>

        <LiveChat
  messages={messages ?? []}
  currentUserId={user.id}
  conversationId={conversation.id}
/>

        <ChatInput conversationId={conversation.id} />
      </div>
    </div>
  );
}
