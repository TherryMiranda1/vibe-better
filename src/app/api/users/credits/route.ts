import { NextRequest, NextResponse } from "next/server";
import { dbAdminService } from "@/lib/services/server/db/dbProducts.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const credits = await dbAdminService.userCredits.getUserCredits(user.id);

    return NextResponse.json({ credits });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch user credits" },
      { status: 500 }
    );
  }
}
