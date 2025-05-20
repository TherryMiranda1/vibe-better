import { NextRequest, NextResponse } from "next/server";
import {
  saveUserPrompt,
  getUserPromptsByUserId,
} from "@/lib/services/server/userPrompt.service";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      template, 
      placeholders, 
      nivel, 
      etapa, 
      categoría, 
      instrucciones, 
      notas_para_el_uso,
      title 
    } = body;

    if (!template || !nivel || !etapa || !categoría || !instrucciones || !notas_para_el_uso || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userPrompt = await saveUserPrompt({
      userId: user.id,
      template,
      placeholders: placeholders || [],
      nivel,
      etapa,
      categoría,
      instrucciones,
      notas_para_el_uso,
      title,
    });

    return NextResponse.json(userPrompt);
  } catch (error: any) {
    console.error("Error saving user prompt:", error);
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

    const userPrompts = await getUserPromptsByUserId(user.id);

    return NextResponse.json(userPrompts);
  } catch (error: any) {
    console.error("Error fetching user prompts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
