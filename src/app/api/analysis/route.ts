import { NextRequest, NextResponse } from "next/server";
import {
  saveAnalysis,
  getAnalysesByUserId,
} from "@/lib/services/analysis.service";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, activeAnalyses, resultsContent, title } = body;

    if (!prompt || !activeAnalyses || !resultsContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const analysis = await saveAnalysis({
      userId: user.id,
      prompt,
      activeAnalyses,
      resultsContent,
      title: title || `Analysis ${new Date().toLocaleString()}`,
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error saving analysis:", error);
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

    const analyses = await getAnalysesByUserId(user.id);

    return NextResponse.json(analyses);
  } catch (error: any) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
