"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useEffect, useState } from "react";

const posters = [
  "/posters-homepage/poster-1.png",
  "/posters-homepage/poster-2.png",
  "/posters-homepage/poster-3.png",
  "/posters-homepage/poster-4.png",
  "/posters-homepage/poster-5.png",
  "/posters-homepage/poster-6.png",
];

export default function HomePage() {
  // Bouncing K logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ x: 2, y: 2 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const K_SIZE = 48; // px

  // Update container size on mount and resize
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setPos((prev) => {
        let { x, y } = prev;
        let { x: vx, y: vy } = vel;
        let { width, height } = containerSize;
        // Bounce off edges
        if (x + K_SIZE >= width || x <= 0) vx = -vx;
        if (y + K_SIZE >= height || y <= 0) vy = -vy;
        setVel({ x: vx, y: vy });
        return {
          x: Math.max(0, Math.min(x + vx, width - K_SIZE)),
          y: Math.max(0, Math.min(y + vy, height - K_SIZE)),
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    if (containerSize.width && containerSize.height) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerSize, vel]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
      <div
        className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        ref={containerRef}
        style={{ minHeight: 0 }}
      >
        {/* Bouncing K */}
        <div
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: K_SIZE,
            height: K_SIZE,
            fontSize: K_SIZE,
            fontWeight: "bold",
            color: "#fff",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 20,
            textShadow: "0 2px 8px #000, 0 0 2px #fff",
            transition: "none",
          }}
        >
          K
        </div>
        {/* Carousel */}
        <Carousel plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {posters.map((src, idx) => (
              <CarouselItem key={idx}>
                <div className="relative aspect-[1081/1351] w-full rounded-3xl border border-white overflow-hidden shadow-lg mx-auto">
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
          <CarouselPrevious className="left-2 md:-left-14" />
          <CarouselNext className="right-2 md:-right-14" />
        </Carousel>
      </div>
    </div>
  );
}
