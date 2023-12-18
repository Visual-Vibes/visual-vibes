import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getVibes, generateImagePrompts } from "./openAIUtils";
import OpenAI from "openai";
import { decode } from "base64-arraybuffer";

export async function POST(request: NextRequest) {
  // Get main subject from request
  const data = await request.formData();
  const mainSubject: string = data.get("subject") as unknown as string;
  const folderName = data.get("folder") as unknown as string;
  const apiKey = data.get("apiKey") as unknown as string;

  // Make supabase and openai clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  const openAIClient = new OpenAI({ apiKey: apiKey });

  // Generate and save all images
  // Get public urls in return
  const urlList = await generateImagesFromMainSubject(
    mainSubject,
    folderName,
    supabase,
    openAIClient
  );

  console.log("Vibes Generated!");

  // Return a NextResponse with the defined structure
  const responseData = {
    success: true,
    urls: urlList, // Rename the property to 'urls' or any name you prefer
  };

  const toRespond = NextResponse.json(responseData);
  // console.log(toRespond);
  return toRespond;
}

async function generateImagesFromMainSubject(
  mainSubject: string,
  folderName: string,
  supabase: SupabaseClient,
  openAIClient: OpenAI
) {

  // Generate all images
  const imageList = [];
  for (let i = 0; i < allScenes.length; i++) {
    const response = await openAIClient.images.generate({
      model: "dall-e-3",
      prompt: allScenes[i],
      n: 1,
      response_format: "b64_json",
      size: "1024x1024",
    });

    imageList.push(response);
  }

  // Wait for all images to be generated
  const allImages = (await Promise.all(imageList)).map((res) => {
    return res.data[0].b64_json;
  });
  console.log("Generated all images");

  // Write all images to supabase
  const allImageSaveResponses = [];
  for (let i = 0; i < allImages.length; i++) {
    const response = writeImageToSupabase(
      folderName,
      `image_${i}`,
      allImages[i] as string,
      supabase
    );
    allImageSaveResponses.push(response);
  }
  await Promise.all(allImageSaveResponses);
  console.log("Wrote all images to supabase");

  // Get all public Urls of images
  const urlList = await getImageUrlsInFolder(folderName, "gallery", supabase);
  console.log("Got all public urls of images:");
  console.log(urlList);

  return urlList;
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

const constructImagePrompt = async (mainSubject: string, context: string) => {
  const prompt = `

  Given the following subject:

  ${mainSubject}

  And this context: 
  
  ${context}

Use this information to craft a creative and witty image generation prompt while keeping the main character unchanged. Vary the main character's pose, action, and surroundings to reflect the situation. 
The prompt should generate a realistic image, not something illustrated. The prompt should also make for a good wallpaper. Keep the defining features of the main character the same whether the main character is a human, animal, or inanimate object.

ONLY RESPOND WITH THE PROMPT. DO NOT INCLUDE the text 'GENERATE AN IMAGE' OR 'MAIN CHARACTER:'.
`;

  const promptWithMainSubject =
    `Main Subject: ${mainSubject} \n\n` +
    prompt +
    `\n\n Make an image of the main subject in this context.`;
  return promptWithMainSubject;
};

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
