import { NextRequest, NextResponse } from "next/server";
import {
  saveUserContext,
  getUserContextsByUserId,
} from "@/lib/services/server/userContext.service";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, category, slug } = body;

    if (!content || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userContext = await saveUserContext({
      userId: user.id,
      content,
      slug,
      category,
    });

    return NextResponse.json(userContext);
  } catch (error: any) {
    console.error("Error saving user context:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userContexts = await getUserContextsByUserId(user.id);

    return NextResponse.json(userContexts);
  } catch (error: any) {
    console.error("Error fetching user contexts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
