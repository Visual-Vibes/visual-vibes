import PublicGallery from "@/components/PublicGallery";
import { createClient } from "@supabase/supabase-js";

export type Collection = {
  folder: string;
  label: string;
  imageUrl: string;
  description: string;
};

export type GalleryItems = {
  items: Collection[];
};

export const revalidate = 0;

const getGalleryItems = async (): Promise<GalleryItems> => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_SERVER_ROLE_KEY as string
  );

  // Get all public folders
  const { data: publicEntries, error: publicFoldersError } = await supabase
    .from("sequences")
    .select("*")
    .eq("isPublic", true);
  if (!publicEntries) {
    return { items: [] };
  }

  const results: GalleryItems = { items: [] };
  // Get all first images from public gallery folders to be used for collection preview
  for (let i = 0; i < publicEntries.length; i++) {
    const folderName = publicEntries[i].galleryFolder;

    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(`${folderName}/image0.png`);

    const collection: Collection = {
      folder: folderName,
      label: publicEntries[i].label,
      imageUrl: data.publicUrl,
      description: publicEntries[i].description,
    };

    results.items.push(collection);
  }

  return results;
};

export default async function GalleryPage() {
  const galleryItems: GalleryItems = await getGalleryItems();

  // const galleryItems = [
  //   {
  //     label: "Test1",
  //     imageSrc: "https://picsum.photos/500",
  //     description: "This is a test",
  //   },
  //   {
  //     label: "Test2",
  //     imageSrc: "https://picsum.photos/200",
  //     description: "This is a test",
  //   },
  //   {
  //     label: "Test3",
  //     imageSrc: "https://picsum.photos/700",
  //     description: "This is a test",
  //   },
  //   {
  //     label: "Test4",
  //     imageSrc: "https://picsum.photos/100",
  //     description: "This is a test",
  //   },
  // ];

  return (
    <div>
      <PublicGallery items={galleryItems.items} />
    </div>
  );
}
