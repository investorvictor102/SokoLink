import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConversationList from "@/components/messages/ConversationList";
import EmptyConversation from "@/components/messages/EmptyConversation";

export default async function MessagesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      id,
      buyer_id,
      seller_id,
      items (
        name
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">💬 Inbox</h1>
        <p className="text-red-600">Couldn't load conversations.</p>
      </div>
    );
  }

  const inbox = [];

  for (const conversation of conversations ?? []) {
    const otherUserId =
      conversation.buyer_id === user.id
        ? conversation.seller_id
        : conversation.buyer_id;

    const { data: otherPerson } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", otherUserId)
      .single();
      
      const { data: lastMessage } = await supabase
  .from("messages")
  .select("message, created_at")
  .eq("conversation_id", conversation.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

    inbox.push({
  id: conversation.id,
  itemName: conversation.items?.[0]?.name ?? "Conversation",
  otherName: otherPerson?.full_name ?? "Unknown user",
  lastMessage: lastMessage?.message ?? "No messages yet",
  lastTime: lastMessage?.created_at ?? null,
});
  }

  return (
  <div className="mx-auto max-w-7xl rounded-card border border-border bg-white shadow-sm">

    <div className="grid h-[80vh] md:grid-cols-[340px_1fr]">

      <ConversationList inbox={inbox} />

      <EmptyConversation />

    </div>

  </div>
);
}
