import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConversationList from "@/components/messages/ConversationList";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {/*
        h-[80vh] + overflow-hidden on the grid pins the shell's height.
        Each grid column below gets its own min-h-0 + overflow-y-auto,
        which is what lets the list and the active conversation scroll
        independently instead of the whole page scrolling as one block.
      */}
      <div className="grid h-[80vh] overflow-hidden md:grid-cols-[340px_1fr]">
        {error ? (
          <div className="flex h-full min-h-0 flex-col items-center justify-center border-b border-border p-8 text-center md:border-b-0 md:border-r">
            <p className="text-red-600">Couldn't load conversations.</p>
          </div>
        ) : (
          <ConversationList inbox={inbox} />
        )}

        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
