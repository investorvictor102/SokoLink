"use client";

import { useEffect, useState } from "react";

const messages = [
  "Finding great deals across Kenya...",
  "Loading nearby sellers...",
  "Checking fresh listings...",
  "Almost ready...",
];

export default function LoadingHeader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-10 text-center">

      <div className="text-5xl animate-pulse">
        🛍️
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold text-brand">
        SokoLink
      </h1>

      <p className="mt-3 h-6 text-sm font-medium text-brand transition-all duration-500">
        {messages[index]}
      </p>

      <p className="mt-1 text-xs text-muted">
        Bringing you trusted sellers and fresh deals.
      </p>

    </div>
  );
}
