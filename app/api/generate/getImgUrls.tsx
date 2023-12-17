import { SupabaseClient } from "@supabase/supabase-js";

export async function getImageUrlsInFolder(
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
