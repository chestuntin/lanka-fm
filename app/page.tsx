import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
    <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
      <div className="relative w-full max-w-2xl mx-auto">
        <Carousel plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {posters.map((src, idx) => (
              <CarouselItem key={idx}>
                <div
                  className="relative aspect-[1081/1351] w-full rounded-3xl border border-white overflow-hidden shadow-lg mx-auto"
                  style={{ width: "480px", height: "600px" }}
                >
                  <Image
                    src={src}
                    alt={`Poster ${idx + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-3xl"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
}
