import { NextRequest, NextResponse } from "next/server";
import {
  saveFeedback,
  getFeedbackByUserId,
  getPublicFeedback,
} from "@/lib/services/server/feedback.service";
import { getCurrentUser } from "@/lib/auth";
import { FeedbackCategory } from "@/types/feedback";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    const body = await req.json();
    const { rating, category, message, name, email, allowPublic } = body;

    if (!rating || !category || !message || allowPublic === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(FeedbackCategory).includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const feedback = await saveFeedback({
      userId: user?.id || uuid(),
      rating,
      category,
      message,
      name: name || null,
      email: email || null,
      allowPublic,
    });

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const url = new URL(req.url);
    const showPublic = url.searchParams.get("public") === "true";

    if (showPublic) {
      const publicFeedback = await getPublicFeedback();
      return NextResponse.json(publicFeedback);
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userFeedback = await getFeedbackByUserId(user.id);
    return NextResponse.json(userFeedback);
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
