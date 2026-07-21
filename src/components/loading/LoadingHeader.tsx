const messages = [
  "Finding great deals...",
  "Loading nearby sellers...",
  "Checking fresh listings...",
  "Almost ready...",
];

export default function LoadingHeader() {
  return (
    <div className="mb-10 text-center">
      <div className="text-5xl">🛍️</div>

      <h1 className="mt-3 font-display text-3xl font-bold text-brand">
        SokoLink
      </h1>

      <p className="mt-2 text-muted">
        {messages[0]}
      </p>
    </div>
  );
}
