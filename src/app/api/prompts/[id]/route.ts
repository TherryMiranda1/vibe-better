import { NextRequest, NextResponse } from "next/server";
import { 
  getUserPromptById, 
  updateUserPrompt, 
  deleteUserPrompt 
} from "@/lib/services/server/userPrompt.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userPrompt = await getUserPromptById(params.id);
    
    if (!userPrompt) {
      return NextResponse.json(
        { error: "User prompt not found" },
        { status: 404 }
      );
    }

    // Ensure the user can only access their own prompts
    if (userPrompt.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(userPrompt);
  } catch (error: any) {
    console.error("Error fetching user prompt:", error);
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    const updatedPrompt = await updateUserPrompt(
      params.id,
      user.id,
      {
        template,
        placeholders,
        nivel,
        etapa,
        categoría,
        instrucciones,
        notas_para_el_uso,
        title,
      }
    );
    
    if (!updatedPrompt) {
      return NextResponse.json(
        { error: "User prompt not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPrompt);
  } catch (error: any) {
    console.error("Error updating user prompt:", error);
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const success = await deleteUserPrompt(params.id, user.id);
    
    if (!success) {
      return NextResponse.json(
        { error: "User prompt not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user prompt:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
