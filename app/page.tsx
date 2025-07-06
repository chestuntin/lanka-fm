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
import Head from "next/head";

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

  // For debugging: visualize carousel boundaries
  const [carouselRect, setCarouselRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    function updateRect() {
      if (carouselRef.current) {
        setCarouselRect(carouselRef.current.getBoundingClientRect());
      }
    }
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);
  // Also update on every animation frame
  useEffect(() => {
    let running = true;
    function update() {
      if (!running) return;
      if (carouselRef.current) {
        setCarouselRect(carouselRef.current.getBoundingClientRect());
      }
      requestAnimationFrame(update);
    }
    update();
    return () => {
      running = false;
    };
  }, []);

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
        let nextX = x + vx;
        let nextY = y + vy;
        // Window edge bounce
        if (nextX + K_SIZE >= width) {
          vx = -Math.abs(vx);
          nextX = width - K_SIZE;
        } else if (nextX <= 0) {
          vx = Math.abs(vx);
          nextX = 0;
        }
        if (nextY + K_SIZE >= height) {
          vy = -Math.abs(vy);
          nextY = height - K_SIZE;
        } else if (nextY <= 0) {
          vy = Math.abs(vy);
          nextY = 0;
        }
        // Carousel collision (robust: bounce off closest side)
        if (carouselRef.current) {
          const rect = carouselRef.current.getBoundingClientRect();
          const kLeft = nextX;
          const kRight = nextX + K_SIZE;
          const kTop = nextY;
          const kBottom = nextY + K_SIZE;
          const cLeft = rect.left;
          const cRight = rect.right;
          const cTop = rect.top;
          const cBottom = rect.bottom;
          // Check for overlap
          const overlapX = kRight > cLeft && kLeft < cRight;
          const overlapY = kBottom > cTop && kTop < cBottom;
          if (overlapX && overlapY) {
            // Find the minimal distance to each side
            const distLeft = Math.abs(kRight - cLeft);
            const distRight = Math.abs(kLeft - cRight);
            const distTop = Math.abs(kBottom - cTop);
            const distBottom = Math.abs(kTop - cBottom);
            const minDist = Math.min(distLeft, distRight, distTop, distBottom);
            if (minDist === distLeft) {
              // Hit left side
              vx = -Math.abs(vx);
              nextX = cLeft - K_SIZE;
            } else if (minDist === distRight) {
              // Hit right side
              vx = Math.abs(vx);
              nextX = cRight;
            } else if (minDist === distTop) {
              // Hit top side
              vy = -Math.abs(vy);
              nextY = cTop - K_SIZE;
            } else if (minDist === distBottom) {
              // Hit bottom side
              vy = Math.abs(vy);
              nextY = cBottom;
            }
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
      {/* Google Fonts for Sinhala */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* Debug: Carousel bounding box overlay */}
      {carouselRect && (
        <div
          style={{
            position: "fixed",
            left: carouselRect.left,
            top: carouselRect.top,
            width: carouselRect.width,
            height: carouselRect.height,
            border: "2px solid red",
            zIndex: 9998,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Debug: Show K position and velocity (bottom right) */}
      <div
        style={{
          position: "fixed",
          bottom: 8,
          right: 8,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          fontSize: 14,
          padding: "6px 12px",
          borderRadius: 8,
          zIndex: 10000,
          fontFamily: "monospace",
          pointerEvents: "none",
        }}
      >
        <div>
          K Position: x={pos.x.toFixed(1)}, y={pos.y.toFixed(1)}
        </div>
        <div>
          K Velocity: vx={vel.x.toFixed(3)}, vy={vel.y.toFixed(3)}
        </div>
      </div>
      {/* Bouncing K in viewport */}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: K_SIZE,
          height: K_SIZE,
          fontSize: K_SIZE,
          fontWeight: 700,
          color: "#fff",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 9999,
          textShadow: "0 2px 8px #000, 0 0 2px #fff",
          transition: "none",
          fontFamily: "Noto Sans Sinhala",
        }}
      >
        කල්චර්®
      </div>
      {/* Fixed KULTJUR® on the opposite side (top right) */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 24,
          fontSize: K_SIZE,
          fontWeight: 700,
          color: "#fff",
          zIndex: 9999,
          textShadow: "0 2px 8px #000, 0 0 2px #fff",
          fontFamily: "Noto Sans Sinhala, sans-serif",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        KULTJUR®
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
