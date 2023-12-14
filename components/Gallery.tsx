import GalleryCard from "@/components/GalleryCard";
import { GalleryCardProps } from "@/components/GalleryCard";

interface GalleryProps {
  items: Array<GalleryCardProps>;
}

const Gallery: React.FC<GalleryProps> = ({ items }) => (
  <div className="grid grid-cols-3 gap-1 mx-10">
    {items.map((item, index) => (
      <GalleryCard key={index} {...item} />
    ))}
  </div>
);

export default Gallery;
