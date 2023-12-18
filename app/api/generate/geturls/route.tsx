import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Get main subject from request
  const data = await request.formData();
  const folder = data.get("folder") as unknown as string;

  // Make supabase and openai clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  const urlList = await getImageUrlsInFolder(folder, "gallery", supabase);

  return NextResponse.json({ success: true, urls: urlList });
}

async function getImageUrlsInFolder(
  folderName: string,
  storageBucket: string,
  supabase: SupabaseClient
) {
  try {
    const { data: files, error } = await supabase.storage
      .from(storageBucket) // replace with your storage bucket name
      .list(folderName);

    if (error) {
      throw error;
    }

    if (files) {
      // Construct URLs for each file in the folder
      const imageUrls = files.map((file) => {
        return supabase.storage
          .from(storageBucket) // replace with your storage bucket name
          .getPublicUrl(`${folderName}/${file.name}`);
      });
      const urlList = imageUrls.map((json) => {
        return json.data.publicUrl;
      });
      return urlList;
    }

    return [];
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw error;
  }
}
