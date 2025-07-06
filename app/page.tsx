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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ x: 0.4, y: 0.4 }); // 5x slower
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const K_SIZE = 48; // px

  // Update viewport size on mount and resize
  useEffect(() => {
    function updateSize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Animation loop with carousel collision
  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setPos((prev) => {
        let { x, y } = prev;
        let { x: vx, y: vy } = vel;
        let { width, height } = viewport;
        // Window edge bounce
        let nextX = x + vx;
        let nextY = y + vy;
        let bouncedX = false;
        let bouncedY = false;
        if (nextX + K_SIZE >= width || nextX <= 0) {
          vx = -vx;
          bouncedX = true;
        }
        if (nextY + K_SIZE >= height || nextY <= 0) {
          vy = -vy;
          bouncedY = true;
        }
        // Carousel collision
        if (carouselRef.current) {
          const rect = carouselRef.current.getBoundingClientRect();
          // K's next bounding box
          const kLeft = nextX;
          const kRight = nextX + K_SIZE;
          const kTop = nextY;
          const kBottom = nextY + K_SIZE;
          // Carousel bounding box (relative to viewport)
          const cLeft = rect.left;
          const cRight = rect.right;
          const cTop = rect.top;
          const cBottom = rect.bottom;
          // Check horizontal collision
          if (
            kRight > cLeft &&
            kLeft < cRight &&
            kBottom > cTop &&
            kTop < cBottom
          ) {
            // Determine which side is hit (horizontal or vertical)
            const prevKLeft = x;
            const prevKRight = x + K_SIZE;
            const prevKTop = y;
            const prevKBottom = y + K_SIZE;
            // If previously outside horizontally, now inside: bounce X
            if (
              (prevKRight <= cLeft && kRight > cLeft) ||
              (prevKLeft >= cRight && kLeft < cRight)
            ) {
              vx = -vx;
              bouncedX = true;
            }
            // If previously outside vertically, now inside: bounce Y
            if (
              (prevKBottom <= cTop && kBottom > cTop) ||
              (prevKTop >= cBottom && kTop < cBottom)
            ) {
              vy = -vy;
              bouncedY = true;
            }
            // If both, bounce both
            if (!bouncedX && !bouncedY) {
              // Default: bounce X
              vx = -vx;
            }
            // Move K just outside the carousel to prevent sticking
            if (vx < 0) nextX = cRight; // coming from right
            else if (vx > 0) nextX = cLeft - K_SIZE; // coming from left
            if (vy < 0) nextY = cBottom; // coming from below
            else if (vy > 0) nextY = cTop - K_SIZE; // coming from above
          }
        }
        setVel({ x: vx, y: vy });
        return {
          x: Math.max(0, Math.min(nextX, width - K_SIZE)),
          y: Math.max(0, Math.min(nextY, height - K_SIZE)),
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    if (viewport.width && viewport.height) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport, vel]);

  return (
    <>
      {/* Bouncing K in viewport */}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: K_SIZE,
          height: K_SIZE,
          fontSize: K_SIZE,
          fontWeight: "bold",
          color: "#fff",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 9999,
          textShadow: "0 2px 8px #000, 0 0 2px #fff",
          transition: "none",
        }}
      >
        K
      </div>
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <div
          className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
          ref={carouselRef}
          style={{ minHeight: 0 }}
        >
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
    </>
  );
}
