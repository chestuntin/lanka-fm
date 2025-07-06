"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
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
  const K_FONT_SIZE = Math.round(32 * 0.9); // 10% smaller

  // Update viewport size on mount and resize
  useEffect(() => {
    function updateSize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Bouncing text size measurement
  const bouncingTextRef = useRef<HTMLDivElement>(null);
  const [bouncingSize, setBouncingSize] = useState({ width: 48, height: 48 });
  useEffect(() => {
    function updateSize() {
      if (bouncingTextRef.current) {
        const rect = bouncingTextRef.current.getBoundingClientRect();
        setBouncingSize({ width: rect.width, height: rect.height });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  useEffect(() => {
    if (!bouncingTextRef.current) return;
    let running = true;
    function update() {
      if (!running) return;
      if (bouncingTextRef.current) {
        const rect = bouncingTextRef.current.getBoundingClientRect();
        setBouncingSize({ width: rect.width, height: rect.height });
      }
      requestAnimationFrame(update);
    }
    update();
    return () => {
      running = false;
    };
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
        // Window edge bounce (use measured text size)
        if (nextX + bouncingSize.width >= width) {
          vx = -Math.abs(vx);
          nextX = width - bouncingSize.width;
        } else if (nextX <= 0) {
          vx = Math.abs(vx);
          nextX = 0;
        }
        if (nextY + bouncingSize.height >= height) {
          vy = -Math.abs(vy);
          nextY = height - bouncingSize.height;
        } else if (nextY <= 0) {
          vy = Math.abs(vy);
          nextY = 0;
        }
        // Carousel collision (robust: bounce off closest side)
        if (carouselRef.current) {
          const rect = carouselRef.current.getBoundingClientRect();
          const kLeft = nextX;
          const kRight = nextX + bouncingSize.width;
          const kTop = nextY;
          const kBottom = nextY + bouncingSize.height;
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
              nextX = cLeft - bouncingSize.width;
            } else if (minDist === distRight) {
              // Hit right side
              vx = Math.abs(vx);
              nextX = cRight;
            } else if (minDist === distTop) {
              // Hit top side
              vy = -Math.abs(vy);
              nextY = cTop - bouncingSize.height;
            } else if (minDist === distBottom) {
              // Hit bottom side
              vy = Math.abs(vy);
              nextY = cBottom;
            }
          }
        }
        setVel({ x: vx, y: vy });
        return {
          x: Math.max(0, Math.min(nextX, width - bouncingSize.width)),
          y: Math.max(0, Math.min(nextY, height - bouncingSize.height)),
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

  // --- Second bouncing text (KULTJUR®) ---
  const KULTJUR_FONT_SIZE = Math.round(K_FONT_SIZE * 0.92); // 8% smaller
  const bouncingTextRef2 = useRef<HTMLDivElement>(null);
  const [bouncingSize2, setBouncingSize2] = useState({ width: 48, height: 48 });
  useEffect(() => {
    function updateSize2() {
      if (bouncingTextRef2.current) {
        const rect = bouncingTextRef2.current.getBoundingClientRect();
        setBouncingSize2({ width: rect.width, height: rect.height });
      }
    }
    updateSize2();
    window.addEventListener("resize", updateSize2);
    return () => window.removeEventListener("resize", updateSize2);
  }, []);
  useEffect(() => {
    if (!bouncingTextRef2.current) return;
    let running = true;
    function update() {
      if (!running) return;
      if (bouncingTextRef2.current) {
        const rect = bouncingTextRef2.current.getBoundingClientRect();
        setBouncingSize2({ width: rect.width, height: rect.height });
      }
      requestAnimationFrame(update);
    }
    update();
    return () => {
      running = false;
    };
  }, []);
  // Start at top right
  const [pos2, setPos2] = useState({
    x: typeof window !== "undefined" ? window.innerWidth - 50 - 48 : 500,
    y: 50,
  });
  const [vel2, setVel2] = useState({ x: -0.4, y: 0.4 });
  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setPos2((prev) => {
        let { x, y } = prev;
        let { x: vx, y: vy } = vel2;
        let { width, height } = viewport;
        let nextX = x + vx;
        let nextY = y + vy;
        // Window edge bounce (use measured text size)
        if (nextX + bouncingSize2.width >= width) {
          vx = -Math.abs(vx);
          nextX = width - bouncingSize2.width;
        } else if (nextX <= 0) {
          vx = Math.abs(vx);
          nextX = 0;
        }
        if (nextY + bouncingSize2.height >= height) {
          vy = -Math.abs(vy);
          nextY = height - bouncingSize2.height;
        } else if (nextY <= 0) {
          vy = Math.abs(vy);
          nextY = 0;
        }
        // Carousel collision (robust: bounce off closest side)
        if (carouselRef.current) {
          const rect = carouselRef.current.getBoundingClientRect();
          const kLeft = nextX;
          const kRight = nextX + bouncingSize2.width;
          const kTop = nextY;
          const kBottom = nextY + bouncingSize2.height;
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
              nextX = cLeft - bouncingSize2.width;
            } else if (minDist === distRight) {
              // Hit right side
              vx = Math.abs(vx);
              nextX = cRight;
            } else if (minDist === distTop) {
              // Hit top side
              vy = -Math.abs(vy);
              nextY = cTop - bouncingSize2.height;
            } else if (minDist === distBottom) {
              // Hit bottom side
              vy = Math.abs(vy);
              nextY = cBottom;
            }
          }
        }
        setVel2({ x: vx, y: vy });
        return {
          x: Math.max(0, Math.min(nextX, width - bouncingSize2.width)),
          y: Math.max(0, Math.min(nextY, height - bouncingSize2.height)),
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    if (viewport.width && viewport.height) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport, vel2, bouncingSize2]);

  // Randomize starting position and velocity for both logos
  useEffect(() => {
    if (!carouselRef.current) return;
    const rect = carouselRef.current.getBoundingClientRect();
    // Sinhala: left 20% of carousel
    const leftMin = rect.left;
    const leftMax = rect.left + rect.width * 0.2;
    const yMin = rect.top;
    const yMax = rect.bottom - bouncingSize.height;
    const randX = leftMin + Math.random() * (leftMax - leftMin);
    const randY = yMin + Math.random() * (yMax - yMin);
    setPos({ x: randX, y: randY });
    // Random velocity, not zero
    let vx = (Math.random() - 0.5) * 1.2;
    let vy = (Math.random() - 0.5) * 1.2;
    if (Math.abs(vx) < 0.2) vx = 0.4 * Math.sign(vx) || 0.4;
    if (Math.abs(vy) < 0.2) vy = 0.4 * Math.sign(vy) || 0.4;
    setVel({ x: vx, y: vy });
    // English: right 20% of carousel
    const rightMin = rect.right - rect.width * 0.2;
    const rightMax = rect.right - bouncingSize2.width;
    const randX2 = rightMin + Math.random() * (rightMax - rightMin);
    const randY2 = yMin + Math.random() * (yMax - yMin);
    setPos2({ x: randX2, y: randY2 });
    let vx2 = (Math.random() - 0.5) * 1.2;
    let vy2 = (Math.random() - 0.5) * 1.2;
    if (Math.abs(vx2) < 0.2) vx2 = -0.4 * Math.sign(vx2) || -0.4;
    if (Math.abs(vy2) < 0.2) vy2 = 0.4 * Math.sign(vy2) || 0.4;
    setVel2({ x: vx2, y: vy2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselRef.current, bouncingSize.height, bouncingSize2.width]);

  return (
    <>
      {/* Google Fonts for Sinhala */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* Debug: Show Sinhala K position and velocity (top left) */}
      <div
        style={{
          position: "fixed",
          top: 8,
          left: 8,
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
          කල්චර්® Position: x={pos.x.toFixed(1)}, y={pos.y.toFixed(1)}
        </div>
        <div>
          කල්චර්® Velocity: vx={vel.x.toFixed(3)}, vy={vel.y.toFixed(3)}
        </div>
      </div>
      {/* Debug: Show English KULTJUR® position and velocity (bottom right) */}
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
          KULTJUR® Position: x={pos2.x.toFixed(1)}, y={pos2.y.toFixed(1)}
        </div>
        <div>
          KULTJUR® Velocity: vx={vel2.x.toFixed(3)}, vy={vel2.y.toFixed(3)}
        </div>
      </div>
      {/* Bouncing K in viewport */}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          fontSize: K_FONT_SIZE,
          fontWeight: 400,
          color: "#fff",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 9999,
          textShadow: "0 2px 8px #000, 0 0 2px #fff",
          transition: "none",
          fontFamily: "Noto Sans Sinhala",
        }}
        ref={bouncingTextRef}
      >
        <span>
          කල්චර්
          <sup
            style={{ fontSize: "0.6em", verticalAlign: "super", marginLeft: 2 }}
          >
            ®
          </sup>
        </span>
      </div>
      {/* Bouncing KULTJUR® in viewport */}
      <div
        style={{
          position: "fixed",
          left: pos2.x,
          top: pos2.y,
          fontSize: KULTJUR_FONT_SIZE,
          fontWeight: 400,
          color: "#fff",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 9999,
          textShadow: "0 2px 8px #000, 0 0 2px #fff",
          transition: "none",
          fontFamily: "Noto Sans Sinhala",
        }}
        ref={bouncingTextRef2}
      >
        <span>
          KULTJUR
          <sup
            style={{ fontSize: "0.6em", verticalAlign: "super", marginLeft: 2 }}
          >
            ®
          </sup>
        </span>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-[#09090b]">
        <div
          className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
          ref={carouselRef}
          style={{ minHeight: 0 }}
        >
          {/* Carousel */}
          <Carousel>
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
