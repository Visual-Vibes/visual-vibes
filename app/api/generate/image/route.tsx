import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Get main subject from request
  const data = await request.formData();
  const prompt = data.get("prompt") as unknown as string;
  const apiKey = data.get("apiKey") as unknown as string;

  // Make supabase and openai clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  const openAIClient = new OpenAI({ apiKey: apiKey });

  // Generate a single image from the prompt
  return NextResponse.json({ success: true });
}
