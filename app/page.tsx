import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const posters = [
  "/posters-homepage/poster-1.png",
  "/posters-homepage/poster-2.png",
  "/posters-homepage/poster-3.png",
  "/posters-homepage/poster-4.png",
  "/posters-homepage/poster-5.png",
  "/posters-homepage/poster-6.png",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
      <div className="w-full max-w-md relative">
        <Carousel>
          <CarouselContent>
            {posters.map((src, idx) => (
              <CarouselItem key={idx}>
                <div
                  className="relative w-full rounded-2xl border border-[#333] overflow-hidden shadow-lg"
                  style={{ aspectRatio: "4 / 5", maxHeight: "60vh" }}
                >
                  <Image
                    src={src}
                    alt={`Poster ${idx + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-2xl"
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
