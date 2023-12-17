import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  const { data, error } = await supabase.storage.from("welcome").list();
  if (!data) {
    console.log("Error getting welcome images", error);
    return NextResponse.json({ success: false });
  }

  const imageNames = data.map((file) => file.name);
  const imageUrls = [];
  for (let i = 0; i < imageNames.length; i++) {
    const { data } = await supabase.storage
      .from("welcome")
      .getPublicUrl(imageNames[i]);
    if (!data) {
      console.log("Error getting welcome images", error);
      return NextResponse.json({ success: false });
    }
    imageUrls.push(data.publicUrl);
  }

  return NextResponse.json({
    success: true,
    imageUrls: imageUrls,
    imageNames: imageNames,
  });
}
