import { NextRequest, NextResponse } from "next/server";
import {
  getUserContextById,
  updateUserContext,
  deleteUserContext,
} from "@/lib/services/server/userContext.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userContext = await getUserContextById(params.id);

    if (!userContext) {
      return NextResponse.json({ error: "Context not found" }, { status: 404 });
    }

    if (userContext.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(userContext);
  } catch (error: any) {
    console.error("Error fetching user context:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, category } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedContext = await updateUserContext(params.id, user.id, {
      content,
      category,
    });

    if (!updatedContext) {
      return NextResponse.json({ error: "Context not found" }, { status: 404 });
    }

    return NextResponse.json(updatedContext);
  } catch (error: any) {
    console.error("Error updating user context:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await deleteUserContext(params.id, user.id);

    if (!success) {
      return NextResponse.json({ error: "Context not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user context:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
