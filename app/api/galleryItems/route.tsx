// pages/api/galleryItems.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from 'next/server';
import { getImageUrlsInFolder } from '../generate/getImgUrls';
import { randomInt } from 'crypto';

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

  // Get 10 sequences for background
  const numSequences = 10 > publicEntries.length - 1 ? publicEntries.length - 1 : 5
  let sequenceStart = randomInt (0, publicEntries.length - 1 - numSequences);
  const results = [];

  // Get a random batch of sequences from the folder and store to results
  for (let i = 0; i < sequenceStart + numSequences; i++) {
    const { data: files } = await supabase.storage
      .from('gallery') // replace with your storage bucket name
      .list(publicEntries[i % (publicEntries.length - 1) ].galleryFolder);
    if (files === null) {
      throw new Error('No files in folder')
    }
    if (files?.length < 3) {
      sequenceStart += 1
    }
    else {
      results.push(await getImageUrlsInFolder(publicEntries[i % (publicEntries.length - 1)].galleryFolder, 'gallery', supabase));
    }
    
  }

  return NextResponse.json(results);
}
