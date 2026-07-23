export default function EmptyConversation() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-paper px-8 text-center">
      <div className="text-6xl">
        💬
      </div>

      <h2 className="mt-5 font-display text-2xl font-bold text-ink">
        Welcome to Messages
      </h2>

      <p className="mt-3 max-w-md text-center text-muted">
        Select a conversation from the left to start chatting with
        buyers and sellers.
      </p>

    </div>
  );
}
