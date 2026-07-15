import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { conversationId, body } = await request.json();

    if (!conversationId || !body?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing message." },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in." },
        { status: 401 }
      );
    }

    const { error } = await supabase
  .from("messages")
  .insert({
    conversation_id: conversationId,
    sender_id: user.id,
    message: body.trim(),
  });
      console.log("Insert error:", error);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
  console.error("Message error:", error);

  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
}
