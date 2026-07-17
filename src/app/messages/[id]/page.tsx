import Link from "next/link";
import Image from "next/image";
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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-card border border-border bg-white p-6">

        {item && (
          <Link
            href={`/items/${item.id}`}
            className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-gray-50 p-4 transition hover:border-brand"
          >
            {item.image_urls?.[0] && (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                <Image
                  src={item.image_urls[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {item.name}
              </h2>

              <p className="mt-1 text-brand font-semibold">
                KES {item.price_kes.toLocaleString()}
              </p>

              <p className="mt-2 text-sm text-blue-600">
                View Listing →
              </p>
            </div>
          </Link>
        )}

        <LiveChat
          messages={messages ?? []}
          currentUserId={user.id}
          conversationId={conversation.id}
        />

        <div className="mt-4">
          <ChatInput conversationId={conversation.id} />
        </div>

      </div>
    </div>
  );
}
