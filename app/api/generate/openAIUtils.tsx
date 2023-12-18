// Calls openAI apis to generate and store 12 time-contextualized images similar to the image provided.
// Returns a label that is the main subject of the provided startImage.
import { RequestOptions } from "https";
import { writeFile } from "fs/promises";
import OpenAI from "openai";
import { decode } from "base64-arraybuffer";
import { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function getVibes(
  startImage: string,
  apiKey: string,
  supabaseClient: SupabaseClient
) {
  // Call openai GPT4 Vision Prompt
  try {
    console.log("Generating Vibes...");

    // Generate gallery folder name
    const folderNameHash = crypto.randomBytes(20).toString("hex");

    // Create client
    const openAIClient = new OpenAI({ apiKey: apiKey });

    // Pass client to getMainSubject, returns string describing main subject.
    const mainSubject = await getMainSubject(startImage, openAIClient);
    if (mainSubject == null) {
      return { mainSubject: null, folder: null };
    }
    console.log(mainSubject);
    // Generate image prompts using gpt-3
    const imagePrompts = await generateImagePrompts(mainSubject, openAIClient);

    // Main subject is passed to the image generation function which creates image variants
    await generateImages(
      imagePrompts,
      folderNameHash,
      openAIClient,
      supabaseClient
    );
    return { mainSubject: mainSubject, folder: folderNameHash };
  } catch (error) {
    console.error("Error during openAI api call:", error);
    return null;
  }
}

// Uses start image to retrieve the main subject text from OpenAI
async function getMainSubject(startImage: string, openAIClient: OpenAI) {
  const response = await openAIClient.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Provide a concise description of the main object/character in the image, focusing on its key features without including specific details about its surroundings or actions. " +
              "Only respond with this text. Please include details about the defining features of the main object/character. If you can not find a main object/character, please only respond with a '0'",
          },
          {
            type: "image_url",
            image_url: {
              url: startImage,
              detail: "low",
            },
          },
        ],
      },
    ],
    max_tokens: 200,
  });
  const mainSubject = response.choices[0].message.content;

  if (mainSubject === "0") {
    return null;
  }
  return mainSubject;
}

// Generates image prompts from given main subject and returns an array of strings.
export const generateImagePrompts = async (
  mainSubject: string,
  openAIClient: OpenAI
) => {
  const wakeup = await constructImagePrompt(
    mainSubject,
    "It's 7 am! the main character is just waking up and is performing their morning (human-like) routine."
  );
  const morning = await constructImagePrompt(
    mainSubject,
    "The main character is getting ready for the day by sitting at their table with a quality breakfast that they have cooked."
  );
  const noon = await constructImagePrompt(
    mainSubject,
    "it's time for work! The main character is at their desk, on their computer, or working through their tasks for the day."
  );
  const night = await constructImagePrompt(
    mainSubject,
    "it's bed time! The main character is getting ready for bed by brushing their teeth."
  );
  const instructionsList = [wakeup]; //, morning, noon, night];

  const promptList: string[] = [];
  for (const instruction of instructionsList) {
    // Append main subject to the instruction to guarantee no loss of main subject information
    const instructionWithSubject =
      `Main Subject: ${mainSubject} \n\n` +
      instruction +
      `\n\n Make an image of the main subject in this context.`;

    const response = await openAIClient.chat.completions.create({
      messages: [{ role: "user", content: `${instructionWithSubject}` }],
      model: "gpt-3.5-turbo",
    });

    if (response.choices[0].message.content == null) {
      throw "Got null response in generateImagePrompts";
    }

    promptList.push(
      response.choices[0].message.content +
        "; I NEED the image to be realistic. DO NOT create an illustration. Add black bars image fit in a 16:9 aspect ratio."
    );
  }
  return promptList;
};
export default generateImagePrompts;

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
  return prompt;
};

// Uses provided subject string to create image variants based on prompts and stores them in the supabase db.
const generateImages = async (
  imagePrompts: string[],
  folderNameHash: string,
  openAIClient: OpenAI,
  supabaseClient: SupabaseClient
) => {
  var index = 0;
  const revised_prompts = [];
  for (const imagePrompt of imagePrompts) {
    const response = await openAIClient.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      response_format: "b64_json",
      size: "1024x1024",
    });

    // console.log(response.data);
    if (response.data[0].b64_json == null) {
      throw "Got null response in generateImages";
    }
    const imageName = `image${index}`;
    await writeImageToSupabase(
      folderNameHash,
      imageName,
      response.data[0].b64_json,
      supabaseClient
    );
    await writePromptsToSupabase(
      folderNameHash,
      imagePrompt,
      response.data[0].revised_prompt as string,
      supabaseClient
    );

    console.log(`Original Prompt:
    ${imagePrompt}`);

    console.log(`Revised / Final Prompt:
    ${response.data[0].revised_prompt}`);
    index += 1;
  }
};

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

const writePromptsToSupabase = async (
  folderNameHash: string,
  originalPrompt: string,
  revisedPrompt: string,
  supabaseClient: SupabaseClient
) => {
  const entry = {
    galleryFolder: folderNameHash,
    revisedPrompt: revisedPrompt,
    originalPrompt: originalPrompt,
  };
  const { data, error } = await supabaseClient
    .from("revised_prompts")
    .insert(entry);
  if (error) {
    console.log("Error inserting revised prompt into table", error);
  }
};
