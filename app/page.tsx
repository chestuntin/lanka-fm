import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const posters = [
  "/posters/poster1.jpg",
  "/posters/poster2.jpg",
  "/posters/poster3.jpg",
  // Add more poster paths as needed
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
      <div className="w-full max-w-2xl relative">
        <Carousel>
          <CarouselContent>
            {posters.map((src, idx) => (
              <CarouselItem key={idx}>
                <div className="flex items-center justify-center h-[60vw] max-h-[80vh]">
                  <Image
                    src={src}
                    alt={`Poster ${idx + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
