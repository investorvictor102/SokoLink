import Link from "next/link";

type Props = {
  id: string;
  otherName: string;
  itemName: string;
  lastMessage: string;
  lastTime: string | null;
  active?: boolean;
};

export default function ConversationCard({
  id,
  otherName,
  itemName,
  lastMessage,
  lastTime,
  active = false,
}: Props) {
  return (
    <Link
      href={`/messages/${id}`}
      className={`block border-b border-border p-4 transition hover:bg-brand-light ${
        active ? "bg-brand-light" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">

        {/* Avatar */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {otherName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between">

            <h2 className="truncate font-semibold text-ink">
              {otherName}
            </h2>

            {lastTime && (
              <span className="text-xs text-gray-400">
                {new Date(lastTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}

          </div>

          <p className="mt-1 truncate text-sm font-medium text-brand">
            {itemName}
          </p>

          <p className="mt-1 line-clamp-1 text-sm text-muted">
            {lastMessage}
          </p>

        </div>

      </div>
    </Link>
  );
}
