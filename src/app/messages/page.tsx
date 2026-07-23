import EmptyConversation from "@/components/messages/EmptyConversation";

// The conversation list now lives in messages/layout.tsx (shared with
// /messages/[id]) so it can scroll independently of whichever
// conversation is open. This page only renders the "nothing selected
// yet" placeholder for the right-hand pane.
export default function MessagesPage() {
  return <EmptyConversation />;
}
