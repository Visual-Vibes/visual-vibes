import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import crypto from "crypto";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    // Handle the POST request here
    const data = await request.formData()
    const subject = data.get("subject") as unknown as string;
    const apiKey = data.get("apiKey") as unknown as string;
    
    // Create client
    const openAIClient = new OpenAI({ apiKey: apiKey });
    // Get all image prompts

    const wakeup = constructImagePrompt(
      subject,
      "It's 7 am! the main character is just waking up and is performing their morning (human-like) routine."
    );
    const morning = constructImagePrompt(
      subject,
      "The main character is getting ready for the day by sitting at their table with a quality breakfast that they have cooked."
    );
    const noon = constructImagePrompt(
      subject,
      "it's time for work! The main character is at their desk, on their computer, or working through their tasks for the day."
    );
    const night = constructImagePrompt(
      subject,
      "it's bed time! The main character is getting ready for bed by brushing their teeth."
    );

    const allPrompts = await Promise.all([wakeup, morning, noon, night]);
    console.log("Constructed all image prompts");

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
    
    return NextResponse.json({
        scenes: allScenes,
    });
}

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

