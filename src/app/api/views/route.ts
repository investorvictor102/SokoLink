import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { incrementViewIfNeeded } from "@/lib/views";

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Missing itemId" },
        { status: 400 }
      );
    }

    // Prevent repeated views for one hour
    const cookieName = `viewed-${itemId}`;
    
    if (request.cookies.get(cookieName)) {
      return NextResponse.json({
        success: true,
        counted: false,
        reason: "Already viewed recently",
        
      });
    }

    const supabase = createClient();

    // Current signed-in user (if any)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get the item's seller
    const { data: item, error } = await supabase
      .from("items")
      .select("seller_id")
      .eq("id", itemId)
      .single();

    if (error || !item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Increment only if appropriate
    const counted = await incrementViewIfNeeded(
      itemId,
      item.seller_id,
      user?.id ?? null
    );

    const response = NextResponse.json({
      success: true,
      counted,
    });

    // Only set the cookie if we actually counted the view
    if (counted) {
      response.cookies.set({
        name: cookieName,
        value: "1",
        maxAge: 60 * 60, // 1 hour
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("View tracking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
