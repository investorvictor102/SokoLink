"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChatInputProps = {
  conversationId: string;
};

export default function ChatInput({
  conversationId,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  async function sendMessage() {
    if (!message.trim()) return;

    setSending(true);

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        body: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      setSending(false);
      return;
    }

    setMessage("");
    router.refresh();
    setSending(false);
  }

  return (
    <div className="mt-6 flex gap-3">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded-lg border border-border px-4 py-3"
      />

      <button
        onClick={sendMessage}
        disabled={sending}
        className="rounded-lg bg-brand px-5 py-3 font-medium text-white"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
