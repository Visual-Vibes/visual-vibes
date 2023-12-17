// pages/api/galleryItems.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from 'next/server';
import { getImageUrlsInFolder } from '../generate/getImgUrls';
export async function POST(request: NextRequest) {
  // Create supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  // Get all public folders
  const { data: publicEntries, error } = await supabase
    .from("sequences")
    .select("*")
    .eq("isPublic", true);

  if (error) {
    return NextResponse.error()
  }
  if (!publicEntries) {
    return NextResponse.error()
  }
  
  // Get random entry
  const randomEntry = publicEntries[Math.floor(Math.random() * publicEntries.length)];

  // Get a random image in the entry 
    const { data: files } = await supabase.storage
      .from('gallery') // replace with your storage bucket name
      .list(randomEntry.galleryFolder);
    if (files === null) {
      throw new Error('No files in folder')
    }
    else {
      const urls = await getImageUrlsInFolder(randomEntry.galleryFolder, 'gallery', supabase);
      return NextResponse.json(urls);
    }
}
