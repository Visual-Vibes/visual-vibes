import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import crypto from "crypto";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    // Handle the POST request here
    const data = await request.formData()
    const file: File | null = data.get("starterImage") as unknown as File;
    const isPublic = data.get("makePublic") as unknown as string;
    const apiKey = data.get("apiKey") as unknown as string;
    console.log("isPublic", isPublic);
    console.log("apiKey", apiKey);

    if (!file) {
        return NextResponse.json({
        success: false,
        couldNotIdentifyMainSubject: false,
        urls: [],
        });
    }
    // Assuming 'fileName' is the name of your uploaded image file

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imgString = `data:${file.type};base64,${buffer.toString("base64")}`;
    // Get image type and construct image string

    // Create client
    const openAIClient = new OpenAI({ apiKey: apiKey });

    // Pass client to getMainSubject, returns string describing main subject.
    const mainSubject = await getMainSubject(imgString, openAIClient);
    if (mainSubject == null) {
        return NextResponse.json({
            subject: 'failed'
        });
    }

    // Create folder hash
    const folderName = crypto.randomBytes(20).toString("hex");
    
    const status = await writeSupabaseFolder(folderName, isPublic, mainSubject);

    if (status == 'failed') {
        return NextResponse.json({
            subject: 'failed'
        });
    }
    return NextResponse.json({
        subject: mainSubject,
        folder: folderName
    });
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

async function writeSupabaseFolder(folderName: string, isPublic: string, mainSubject: string) {
    // Create supabase client to make folder entry
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_SERVER_ROLE_KEY as string
    );

    const entry = [
        {
        galleryFolder: folderNameHash,
        isPublic: isPublic,
        label: mainSubject,
        },
    ];

    const { data: sequence, error } = await supabase
    .from("sequences")
    .insert(entry);

    if (error) {
        console.log("Error inserting sequence entry into table", error);
        return 'failed'
    }
    return 'success'
}
