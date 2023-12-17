import { createClient } from "@supabase/supabase-js";
import CollectionGallery from "@/components/CollectionGallery";

export type CollectionItems = {
  imageUrls: string[];
  label: string;
};

export const revalidate = 0;

const getCollectionItems = async (
  collection: string
): Promise<CollectionItems> => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  // Get collection label
  const { data, error } = await supabase
    .from("sequences")
    .select("*")
    .eq("galleryFolder", collection)
    .single();
  if (!data) {
    console.log("Error retrieving label for collection: " + collection);
    return { imageUrls: [], label: "" };
  }
  const label = data.label;

  // Get all image URLs for collection
  // Retrieve all files from storage folder
  const { data: files, error: filesError } = await supabase.storage
    .from("gallery")
    .list(collection);
  if (!files) {
    console.log("Error retrieving files for collection: " + collection);
    return { imageUrls: [], label: "" };
  }

  const filenames = files.map((file) => file.name);

  const collectionItems: CollectionItems = { imageUrls: [], label: label };

  // get all public URLS
  for (let i = 0; i < filenames.length; i++) {
    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(`${collection}/${filenames[i]}`);

    collectionItems.imageUrls.push(data.publicUrl);
  }

  return collectionItems;
};

export default async function CollectionPage({
  params,
}: {
  params: { collection: string };
}) {
  const items = await getCollectionItems(params.collection);

  return (
    <div className="bg-gray-900 text-gray-300 p-8 rounded-xl">
      <CollectionGallery imageUrls={items.imageUrls} label={items.label} />
    </div>
  );
}
