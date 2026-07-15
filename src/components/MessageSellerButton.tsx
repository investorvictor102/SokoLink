"use client";

import { useRouter } from "next/navigation";

type MessageSellerButtonProps = {
  itemId: string;
  sellerId: string;
};

export default function MessageSellerButton({
  itemId,
  sellerId,
}: MessageSellerButtonProps) {
  const router = useRouter();

  async function handleClick() {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          sellerId,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      console.log("HTTP Status:", response.status);
      if (!response.ok) {
        alert(data.message || "Couldn't start conversation.");
        return;
      }

      router.push(`/messages/${data.conversationId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-card bg-brand px-4 py-3 font-medium text-white transition hover:bg-brand-dark"
    >
      💬 Message Seller
    </button>
  );
}
