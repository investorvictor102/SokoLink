import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatInput from "@/components/ChatInput";

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

        <div className="mt-8 rounded-lg border border-border p-4 space-y-3 min-h-[300px]">
  {messages && messages.length > 0 ? (
    messages.map((message) => (
      <div
  key={message.id}
  className={`max-w-[80%] ${
    message.sender_id === user.id ? "ml-auto" : "mr-auto"
  }`}
>
  <p
    className={`mb-1 text-xs font-semibold ${
      message.sender_id === user.id
        ? "text-right text-brand"
        : "text-gray-500"
    }`}
  >
    {message.sender_id === user.id ? "You" : "Seller"}
  </p>

  <div
    className={`rounded-lg px-4 py-2 ${
      message.sender_id === user.id
        ? "bg-brand text-white"
        : "bg-gray-100 text-black"
    }`}
  >
    {message.message}
    <p
  className={`mt-1 text-[11px] ${
    message.sender_id === user.id
      ? "text-white/70"
      : "text-gray-500"
  }`}
>
  {new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>
  </div>
</div>
    ))
  ) : (
    <p className="text-center text-muted">
      No messages yet.
    </p>
  )}
</div>

        <ChatInput conversationId={conversation.id} />
      </div>
    </div>
  );
}
