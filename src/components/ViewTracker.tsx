"use client";

import { useEffect } from "react";

type ViewTrackerProps = {
  itemId: string;
};

export default function ViewTracker({ itemId }: ViewTrackerProps) {
  useEffect(() => {
    console.log("ViewTracker fired");

    fetch("/api/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId,
      }),
    });
  }, [itemId]);

  return null;
}
