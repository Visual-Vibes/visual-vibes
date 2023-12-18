import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getVibes, generateImagePrompts } from "./openAIUtils";
import OpenAI from "openai";
import { decode } from "base64-arraybuffer";

export async function POST(request: NextRequest) {
  // Get main subject from request
  const req = await request.json();

  const mainSubject = req.mainSubject;
  const apiKey = req.apiKey;
  const folderName = req.folder;

  // Make supabase and openai clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  const openAIClient = new OpenAI({ apiKey: apiKey });

  // Generate and save all images
  // Get public urls in return
  const urlList = await generateImagesFromMainSubject(
    folderName,
    mainSubject,
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
  // Get all image prompts
  const wakeup = constructImagePrompt(
    mainSubject,
    "It's 7 am! the main character is just waking up and is performing their morning (human-like) routine."
  );
  const morning = constructImagePrompt(
    mainSubject,
    "The main character is getting ready for the day by sitting at their table with a quality breakfast that they have cooked."
  );
  const noon = constructImagePrompt(
    mainSubject,
    "it's time for work! The main character is at their desk, on their computer, or working through their tasks for the day."
  );
  const night = constructImagePrompt(
    mainSubject,
    "it's bed time! The main character is getting ready for bed by brushing their teeth."
  );

  const allPrompts = await Promise.all([wakeup, morning, noon, night]);

  // Generate all scenes
  let sceneList = [];
  for (let i = 0; i < allPrompts.length; i++) {
    const response = openAIClient.chat.completions.create({
      messages: [{ role: "user", content: `${allPrompts[i]}` }],
      model: "gpt-3.5-turbo",
    });

    sceneList.push(response);
  }

  const allScenes = (await Promise.all(sceneList)).map((res) => {
    return (
      res.choices[0].message.content +
      "; I NEED the image to be realistic. DO NOT create an illustration. Add black bars image fit in a 16:9 aspect ratio."
    );
  });

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

  // Write all images to supabase
  const allImageSaveResponses = [];
  const usedImageNames = [];
  for (let i = 0; i < allImages.length; i++) {
    const response = writeImageToSupabase(
      folderName,
      `image_${i}`,
      allImages[i] as string,
      supabase
    );
    usedImageNames.push(`image_${i}`);
    allImageSaveResponses.push(response);
  }

  // Get all public Urls of images
  const urlList = await getImageUrlsInFolder(folderName, "gallery", supabase);

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
