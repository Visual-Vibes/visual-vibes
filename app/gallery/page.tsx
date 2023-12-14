import Gallery from "@/components/Gallery";

export default function GalleryPage() {
  const galleryItems = [
    {
      label: "Test1",
      imageSrc: "https://picsum.photos/500",
      description: "This is a test",
    },
    {
      label: "Test2",
      imageSrc: "https://picsum.photos/200",
      description: "This is a test",
    },
    {
      label: "Test3",
      imageSrc: "https://picsum.photos/700",
      description: "This is a test",
    },
    {
      label: "Test4",
      imageSrc: "https://picsum.photos/100",
      description: "This is a test",
    },
  ];

  return (
    <div>
      <Gallery items={galleryItems} />
    </div>
  );
}
