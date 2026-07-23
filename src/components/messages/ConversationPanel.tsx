import Link from "next/link";
import Image from "next/image";

import LiveChat from "@/components/LiveChat";
import ChatInput from "@/components/ChatInput";

type Item = {
  id: string;
  name: string;
  price_kes: number;
  image_urls: string[];
};

type Message = any;

type Props = {
  item: Item | null;
  messages: Message[];
  conversationId: string;
  currentUserId: string;
};

export default function ConversationPanel({
  item,
  messages,
  conversationId,
  currentUserId,
}: Props) {
  return (
    // min-h-0 is the key fix: without it, a flex child won't shrink
    // below its content size, so LiveChat's flex-1 below never actually
    // gets a bounded height to scroll within — it just keeps growing
    // and pushes the whole page (list included) down instead.
    <div className="flex h-full min-h-0 flex-col">

      {item && (
        <Link
          href={`/items/${item.id}`}
          className="flex shrink-0 items-center gap-4 border-b border-border bg-white p-4 transition hover:bg-brand-light"
        >
          {item.image_urls?.[0] && (
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image
                src={item.image_urls[0]}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <h2 className="font-semibold text-ink">
              {item.name}
            </h2>

            <p className="mt-1 font-medium text-brand">
              KES {item.price_kes.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-blue-600">
              View Listing →
            </p>
          </div>
        </Link>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">
        <LiveChat
          messages={messages}
          currentUserId={currentUserId}
          conversationId={conversationId}
        />
      </div>

      <div className="shrink-0 border-t border-border bg-white p-4">
        <ChatInput conversationId={conversationId} />
      </div>

    </div>
  );
}
