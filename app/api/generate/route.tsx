import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { getVibes, generateImagePrompts } from "./openAIUtils";
import path from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("starterImage") as unknown as File;
  const isPublic = data.get("makePublic") as unknown as string;
  const apiKey = data.get("apiKey") as unknown as string;
  console.log("isPublic", isPublic);
  console.log("apiKey", apiKey);

  if (!file) {
    return NextResponse.json({ success: false });
  }

  // Assuming 'fileName' is the name of your uploaded image file
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const imgString = `data:${file.type};base64,${buffer.toString('base64')}`
  // Get image type and construct image string


  await writeFile(`public/upload/${file.name}`, buffer);
  console.log(`open ${path} to see the uploaded file`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  // send the image(buffer), apiKey, and
  const label = await getVibes(imgString, apiKey, removeFileExtension(file.name), supabase);

  // Add sequence entry into table to specify location of sequence, publication status, and labels
  const entry = [
    {
      galleryFolder: removeFileExtension(file.name),
      isPublic: isPublic,
      label: label,
      description: "TODO: optional description",
    },
  ];

  const { data: sequence, error } = await supabase
    .from("sequences")
    .insert(entry);
  if (error) {
    console.log("Error inserting sequence entry into table");
    NextResponse.json({ success: false });
  }
  console.log('Vibes Generated!')
  return NextResponse.json({ success: true });
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}
