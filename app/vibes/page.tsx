"use client";
import React from "react";
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ImageDisplay from "@/components/ImageDisplay";
import FieldInput from "@/components/FieldInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import ImageSlider from "@/components/ImageSlider";
import dynamic from "next/dynamic";
async function sendPostRequest(endpoint: string, formData: any) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
    console.log("sent request to " + endpoint);
    console.log(response);
    if (response.ok) {
      // If the response status is OK (2xx), parse the JSON data
      var responseData = await response.json();
      // console.log(responseData);
      // Now responseData contains the data from the API response
      return responseData;
    } else {
      // Handle non-OK response (e.g., error handling)
      console.error(
        "Post request to " + endpoint + " returned error",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Post request to " + endpoint + " did not respond");
    return {};
  }
}

export default function Vibes() {
  // Use dynamic imports for FloatingBackground and WelcomeImage
  const FloatingBackground = dynamic(
    () => import("@/components/FloatingBackground/FloatingBackground"),
    { ssr: false }
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [statusText, setStatusText] = useState(
    "Get started by uploading your image!"
  );
  const [makePublic, setMakePublic] = useState(true);
  const [generating, setGenerating] = useState("not-started");
  const [imgUrls, setImgUrls] = useState([
    "https://kputvqghrldexbwkvwgr.supabase.co/storage/v1/object/public/gallery/00eda4f38a3dfc834c4de91cc5f73651cb6544c7/image0.png",
    "https://kputvqghrldexbwkvwgr.supabase.co/storage/v1/object/public/gallery/00eda4f38a3dfc834c4de91cc5f73651cb6544c7/image1.png",
    "https://kputvqghrldexbwkvwgr.supabase.co/storage/v1/object/public/gallery/00eda4f38a3dfc834c4de91cc5f73651cb6544c7/image2.png",
  ]);
  const [prevOpenAIKey, setPrevOpenAIKey] = useState("");

  const checkImageRequirements = (image: any) => {
    // TODO: Implement image req check
    return true;
  };

  const onImageUpload = (e: any) => {
    // console.log(e.target.files[0])
    if (checkImageRequirements(e.target.files[0]) == true) {
      setSelectedImage(e.target.files[0]);
      setStatusText("Image Upload Success!");
    }
  };

  async function runOpenAIGen(e: any) {
    async function getSubjectAndFolder() {
      // Create a FormData object and append the image file to it
      const formData = new FormData();
      if (!selectedImage) {
        setStatusText("Please upload an image before submitting.");
        return;
      }
      formData.append("starterImage", selectedImage);
      formData.append("apiKey", apiKey);
      formData.append("makePublic", makePublic.toString());
      const response = await sendPostRequest("/api/recognize", formData);
      return response;
    }

    async function getImagePrompts(subject: string) {
      // Create a FormData object and append the image file to it
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("apiKey", apiKey);
      const response = await sendPostRequest("/api/prompts", formData);
      return response;
    }

    async function generateImages(
      prompts: string[],
      apiKey: string,
      folder: string
    ) {
      let index = 0;
      for (const prompt of prompts) {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("apiKey", apiKey);
        formData.append("folder", folder);
        formData.append("index", index.toString());
        index++;
        await sendPostRequest("/api/image", formData);
        console.log("Returned from /api/image");
      }
    }

    async function getImgUrls(folder: string) {
      const formData = new FormData();
      formData.append("folder", folder);
      const response = await sendPostRequest("/api/geturls", formData);
      return response;
    }

    // Prevent default form submission behavior
    e.preventDefault();

    // Ensure there is an api key
    if (!apiKey) {
      setStatusText("Please add your API Key before submitting.");
      return;
    }

    // Set status text and generating state
    setGenerating("generating");
    setStatusText("Vibes generating... please be patient!");
    setPrevOpenAIKey(apiKey);

    // Get subject from image
    const folderResponse = await getSubjectAndFolder();
    console.log(folderResponse);

    const folder = folderResponse.folder;
    //Ensure subject was retrieved

    if (folderResponse.subject == "failed") {
      setStatusText(
        "Could not identify a main subject in your image. Please try again with a different image."
      );
      setGenerating("not-started");
    }

    // Call api to generate images
    const promptResponse = await getImagePrompts(folderResponse.subject);

    console.log(promptResponse);

    // Generate images from prompts
    await generateImages(promptResponse.scenes, apiKey, folderResponse.folder);

    const urlResponse = await getImgUrls(folderResponse.folder);
    setImgUrls(urlResponse.urls);

    setStatusText("Vibes Have Been Generated!");
    setGenerating("finished");
  }

  return (
    <div className="">
      {/* <FloatingBackground /> */}
      <div className="z-20 relative">
        <div className="mt-20 mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl bg-gray-900">
          <div className="relative p-8 pt-2 pb-8 shadow-xl rounded-xl font-semibold m-3 bg-gray-800">
            <div className="space-y-6 py-8 text-base leading-7 text-gray-300 divide-y-2 divide-gray-600">
              <h2 className="text-purple-400 text-xl">{statusText}</h2>
              {generating === "not-started" && (
                <div>
                  <p className="mt-2 text-gray-500 font-light">
                    Note: We do not store your API key or your uploaded images.
                  </p>
                  <ImageDisplay
                    image={selectedImage}
                    onRemove={() => {
                      setSelectedImage(null);
                      setStatusText("Please upload a new image");
                    }}
                  />
                  <br />
                  {/* Image Input */}
                  <ImageUploader onChange={onImageUpload} />
                  {/* API Key Input */}
                  <FieldInput
                    placeholder={prevOpenAIKey}
                    onChange={(e: any) => {
                      setApiKey(e.target.value);
                    }}
                  />
                  {/* Make Public Button */}
                  <div className="pt-10">
                    {" "}
                    <input
                      type="checkbox"
                      id="makePublic"
                      name="Make Public"
                      defaultChecked={true}
                      onChange={(e) => {
                        setMakePublic(e.target.checked);
                      }}
                    />
                    <label htmlFor="makePublic" className="text-gray-400">
                      {" "}
                      Make this submission public!
                    </label>
                  </div>
                  <p className="mt-2 text-gray-500 font-light">
                    Note: We do not store your API key or your uploaded images.
                  </p>
                  {/* Submission Button */}
                  <div className="pt-8 text-base font-semibold leading-7">
                    <p className="text-gray-300">Ready?</p>
                    <p>
                      {" "}
                      <button
                        onClick={runOpenAIGen}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        Take me to the vibes! &rarr;
                      </button>{" "}
                    </p>
                  </div>
                </div>
              )}
              {generating === "generating" && <LoadingSpinner />}

              {generating === "finished" && (
                <div>
                  <ImageSlider imageUrls={imgUrls} />
                  <div className="p-4  text-center flex-col justify-center items-center">
                    {!makePublic && (
                      <p className="text-gray-400">
                        Since your generation was private, it is only accessible
                        here.
                      </p>
                    )}
                    {/* <Auth /> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
