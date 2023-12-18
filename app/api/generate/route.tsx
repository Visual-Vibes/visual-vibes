import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { getVibes, generateImagePrompts } from "./openAIUtils";
import { getImageUrlsInFolder } from "./getImgUrls";
import path from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("starterImage") as unknown as File;
  const isPublic = data.get("makePublic") as unknown as string;
  const apiKey = data.get("apiKey") as unknown as string;
  console.log("isPublic", isPublic);
  console.log("apiKey", apiKey);

  if (!file) {
    return NextResponse.json({ status: 503, message: 'No File' });
  }

  // Assuming 'fileName' is the name of your uploaded image file

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const imgString = `data:${file.type};base64,${buffer.toString("base64")}`;
  // Get image type and construct image string

  await writeFile(`public/upload/${file.name}`, buffer);
  console.log(`open ${path} to see the uploaded file`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  // send the image(buffer), apiKey, and
  const res = await getVibes(imgString, apiKey, supabase);
  if (!res) {
    console.log("Error generating vibes");
    return NextResponse.json({
      status: 502,
      couldNotIdentifyMainSubject: false,
      urls: [],
    });
  }

  if (res.mainSubject == null) {
    // Could not identify a main subject
    return NextResponse.json({
      status: 501,
      couldNotIdentifyMainSubject: true,
      urls: [],
    });
  }

  // Add sequence entry into table to specify location of sequence, publication status, and labels
  const entry = [
    {
      galleryFolder: res!.folder,
      isPublic: isPublic,
      label: res!.mainSubject,
      description: "TODO: optional description",
    },
  ];

  const { data: sequence, error } = await supabase
    .from("sequences")
    .insert(entry);
  if (error) {
    console.log("Error inserting sequence entry into table", error);
    return NextResponse.json({
      status: 504,
      couldNotIdentifyMainSubject: false,
      urls: [],
    });
  }
  console.log("Vibes Generated!");

  // Get url list
  const urlList = await getImageUrlsInFolder(
    res!.folder as string,
    "gallery",
    supabase
  );

  // Return a NextResponse with the defined structure
  const responseData = {
    success: true,
    urls: urlList, // Rename the property to 'urls' or any name you prefer
    couldNotIdentifyMainSubject: false,
  };

  const toRespond = NextResponse.json(responseData);
  // console.log(toRespond);
  return toRespond;
}

// function removeFileExtension(filename: string): string {
//   return filename.replace(/\.[^/.]+$/, "");
// }


