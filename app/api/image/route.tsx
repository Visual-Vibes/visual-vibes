import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { decode } from "base64-arraybuffer";

export async function POST(request: NextRequest) {
  // Get main subject from request
  const data = await request.formData();
  const prompt = data.get("prompt") as unknown as string;
  const apiKey = data.get("apiKey") as unknown as string;
  const folder = data.get("folder") as unknown as string;
  const index = data.get("index") as unknown as string;

  // Make supabase and openai clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  const openAIClient = new OpenAI({ apiKey: apiKey });

  const response = await openAIClient.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    response_format: "b64_json",
    size: "1024x1024",
  });

  const image_b64 = response.data[0].b64_json;

  await writeImageToSupabase(
    folder,
    `image_${index}`,
    image_b64 as string,
    supabase
  );

  // Generate a single image from the prompt
  return NextResponse.json({ success: true });
}

const writeImageToSupabase = async (
  folderNameHash: string,
  imageName: string,
  imageData: string,
  supabaseClient: SupabaseClient
) => {
  const { data, error } = await supabaseClient.storage
    .from("gallery")
    .upload(`${folderNameHash}/${imageName}.png`, decode(imageData), {
      contentType: "image/png",
    });
  if (error) {
    console.log("Error uploading images to bucket", error);
    console.log(error);
  }
};
