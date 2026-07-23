"use client";

import { useEffect, useRef, useState } from "react";
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
  const bottomRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to the newest message, but only within this pane —
  // scrollIntoView here only affects the nearest scrollable ancestor
  // (the div below), not the page.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [chatMessages]);

  return (
    // h-full + overflow-y-auto is what makes this pane scroll on its
    // own. Its parent already constrains the available height (see
    // ConversationPanel's min-h-0 wrapper), so this is the only
    // scrollbar that should ever appear for the message thread.
    <div className="h-full space-y-3 overflow-y-auto p-4">
      {chatMessages.length > 0 ? (
        <>
          {chatMessages.map((message) => (
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
          ))}
          <div ref={bottomRef} />
        </>
      ) : (
        <p className="text-center text-muted">
          No messages yet.
        </p>
      )}
    </div>
  );
}
