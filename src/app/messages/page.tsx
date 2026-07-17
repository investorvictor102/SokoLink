import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">
        💬 Inbox
      </h1>

      {inbox.length === 0 ? (
        <p className="text-muted">No conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {inbox.map((chat) => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
              className="block rounded-card border border-border bg-white p-4 hover:border-brand"
            >
              <h2 className="font-semibold">{chat.itemName}</h2>

              <p className="mt-1 text-sm font-medium">
                {chat.otherName}
              </p>

              <p className="mt-1 text-sm text-muted line-clamp-1">
  {chat.lastMessage}
</p>

{chat.lastTime && (
  <p className="mt-1 text-xs text-gray-400">
    {new Date(chat.lastTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>
)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
