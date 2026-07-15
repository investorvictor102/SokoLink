import { NextRequest, NextResponse } from "next/server";
import { getOrCreateConversation } from "@/lib/conversations";

export async function POST(request: NextRequest) {
  try {
    const { itemId, sellerId } = await request.json();

    if (!itemId || !sellerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing itemId or sellerId",
        },
        { status: 400 }
      );
    }

    const conversationId = await getOrCreateConversation(
      itemId,
      sellerId
    );

    return NextResponse.json({
      success: true,
      conversationId,
    });
  } catch (error) {
  console.error("Conversation error:", error);

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
