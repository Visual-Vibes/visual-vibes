// Calls openAI apis to generate and store 12 time-contextualized images similar to the image provided.
// Returns a label that is the main subject of the provided startImage.
import { RequestOptions } from "https";
import { writeFile } from "fs/promises";
import OpenAI from "openai";
import { decode } from "base64-arraybuffer";
import { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

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
      throw "Could not get main subject or main subject was null";
    }
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
            text: "Give me the following response: 'Main Character: *simple description of the main character in the image goes here, as it would be used for image generation*' only respond with this text.",
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
  return mainSubject;
}

// Generates image prompts from given main subject and returns an array of strings.
export const generateImagePrompts = async (
  mainSubject: string,
  openAIClient: OpenAI
) => {
  const wakeup = await constructImagePrompt(
    mainSubject,
    "it's morning! The main character is waking up from a long nights rest."
  );
  const morning = await constructImagePrompt(
    mainSubject,
    "The main character is getting ready for the day by sitting at their table and a quality breakfast that they have cooked."
  );
  const noon = await constructImagePrompt(
    mainSubject,
    "it's time for work! The main character is at their desk, on their computer, and working through their tasks for the day."
  );
  const night = await constructImagePrompt(
    mainSubject,
    "it's bed time! The main character is getting ready for bed by brushing their teeth."
  );
  const instructionsList = [wakeup]; //[wakeup, morning, noon, night];

  const promptList: string[] = [];
  for (const instruction of instructionsList) {
    const response = await openAIClient.chat.completions.create({
      messages: [{ role: "user", content: `${instruction}` }],
      model: "gpt-3.5-turbo",
    });

    if (response.choices[0].message.content == null) {
      throw "Got null response in generateImagePrompts";
    }

    promptList.push(response.choices[0].message.content + '; I NEED the color of the main character to be the same. DO NOT change its color');
  }
  return promptList;
};
export default generateImagePrompts;

const constructImagePrompt = async (mainSubject: string, context: string) => {
  const prompt = `Give me an image generation prompt of the following-- but, the new context is ${context}:

  ${mainSubject}

Change the context to something witty but keep the main character. Feel free to change the main character's pose, action and surroundings.

ONLY RESPOND WITH THE PROMPT. DO NOT INCLUDE 'GENERATE AN IMAGE'
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
