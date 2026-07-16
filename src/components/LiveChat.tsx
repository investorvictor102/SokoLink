"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LiveChatProps = {
  messages: any[];
  currentUserId: string;
  conversationId: string;
};

export default function LiveChat({
  messages,
  currentUserId,
  conversationId,
}: LiveChatProps) {
  const supabase = createClient();

  const [chatMessages, setChatMessages] = useState(messages);
  useEffect(() => {
  const channel = supabase
    .channel(`conversation-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const newMessage = payload.new as any;

        setChatMessages((current) => {
          const exists = current.some(
            (message) => message.id === newMessage.id
          );

          if (exists) return current;

          return [...current, newMessage];
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [conversationId, supabase]);
  return (
    <div className="mt-8 rounded-lg border border-border p-4 space-y-3 min-h-[300px]">
      {chatMessages.length > 0 ? (
       chatMessages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] ${
              message.sender_id === currentUserId
                ? "ml-auto"
                : "mr-auto"
            }`}
          >
            <p
              className={`mb-1 text-xs font-semibold ${
                message.sender_id === currentUserId
                  ? "text-right text-brand"
                  : "text-gray-500"
              }`}
            >
              {message.sender_id === currentUserId
                ? "You"
                : "Seller"}
            </p>

            <div
              className={`rounded-lg px-4 py-2 ${
                message.sender_id === currentUserId
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {message.message}

              <p
                className={`mt-1 text-[11px] ${
                  message.sender_id === currentUserId
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
  );
}
