import PublicGalleryCard from "@/components/PublicGalleryCard";
import { GalleryItems } from "@/app/gallery/page";

const PublicGallery: React.FC<GalleryItems> = ({ items }) => (
  <div className="grid grid-cols-3 gap-1 mx-10">
    {items.map((item, index) => (
      <PublicGalleryCard key={index} {...item} />
    ))}
  </div>
);

export default PublicGallery;
