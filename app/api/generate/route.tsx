import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(`public/upload/${file.name}`, buffer);
  console.log(`open ${path} to see the uploaded file`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  // send the image(buffer), apiKey, and
  const label = await getVibes(buffer);

  // Add sequence entry into table to specify location of sequence, publication status, and labels
  const entry = [
    {
      galleryFolder: removeFileExtension(file.name),
      isPublic: isPublic,
      label: "TODO: The label should be the generated",
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

  return NextResponse.json({ success: true });
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}
