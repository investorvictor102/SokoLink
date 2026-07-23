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
  return (
    <div className="flex h-full flex-col">

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

      <div className="flex-1 overflow-y-auto">

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
            />

          ))

        )}

      </div>

    </div>
  );
}
