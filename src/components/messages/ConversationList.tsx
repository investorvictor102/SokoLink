"use client";

import { usePathname } from "next/navigation";
import ConversationCard from "./ConversationCard";

type Chat = {
  id: string;
  otherName: string;
  itemName: string;
  lastMessage: string;
  lastTime: string | null;
};

type Props = {
  inbox: Chat[];
};

export default function ConversationList({
  inbox,
}: Props) {
  const pathname = usePathname();
  const activeId = pathname?.split("/messages/")[1];

  return (
    // min-h-0 lets this column actually shrink to the grid row's height
    // (h-[80vh] set on the parent in layout.tsx) instead of growing to
    // fit its content, which is what makes overflow-y-auto below scroll
    // on its own, independently of the message panel on the right.
    <div className="flex h-full min-h-0 flex-col border-b border-border md:border-b-0 md:border-r">

      {/* Header */}

      <div className="border-b border-border bg-white p-4">

        <h2 className="font-display text-2xl font-bold text-ink">
          Messages
        </h2>

        <p className="mt-1 text-sm text-muted">
          Your conversations with buyers and sellers.
        </p>

        <input
          type="text"
          placeholder="🔍 Search conversations..."
          className="input-field mt-4"
        />

      </div>

      {/* Conversations */}

      <div className="min-h-0 flex-1 overflow-y-auto">

        {inbox.length === 0 ? (

          <div className="flex h-full items-center justify-center p-8 text-center">

            <div>

              <div className="text-6xl">
                💬
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No conversations yet
              </h3>

              <p className="mt-2 text-muted">
                Once someone contacts you about a product,
                your conversations will appear here.
              </p>

            </div>

          </div>

        ) : (

          inbox.map((chat) => (

            <ConversationCard
              key={chat.id}
              id={chat.id}
              otherName={chat.otherName}
              itemName={chat.itemName}
              lastMessage={chat.lastMessage}
              lastTime={chat.lastTime}
              active={chat.id === activeId}
            />

          ))

        )}

      </div>

    </div>
  );
}
