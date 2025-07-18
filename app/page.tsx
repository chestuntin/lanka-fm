"use client";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import { useRef, useEffect, useState } from "react";
import Head from "next/head";
import { Snowflake, Eye, EyeOff } from "lucide-react";
import ChatInput from "@/components/ChatInput";

// Utility: detect mobile (stateful)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function check() {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// Custom hook for bouncing elements
function useBouncingElement(
  content: string,
  isFrozen: boolean,
  isMobile: boolean,
  zIndex: number = 9999
) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ x: 0.4, y: 0.4 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 48, height: 48 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Update viewport size
  useEffect(() => {
    function updateSize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Measure element size
  useEffect(() => {
    function updateSize() {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [content]);

  // Animation loop
  useEffect(() => {
    if (isFrozen) return;

    let animationFrame: number;
    function animate() {
      setPos((prev) => {
        let { x, y } = prev;
        let { x: vx, y: vy } = vel;
        let { width, height } = viewport;
        let nextX = x + vx * (isMobile ? 2 : 1);
        let nextY = y + vy * (isMobile ? 2 : 1);

        // Window edge bounce
        if (nextX + size.width >= width) {
          vx = -Math.abs(vx);
          nextX = width - size.width;
        } else if (nextX <= 0) {
          vx = Math.abs(vx);
          nextX = 0;
        }
        if (nextY + size.height >= height) {
          vy = -Math.abs(vy);
          nextY = height - size.height;
        } else if (nextY <= 0) {
          vy = Math.abs(vy);
          nextY = 0;
        }

        setVel({ x: vx, y: vy });
        return {
          x: Math.max(0, Math.min(nextX, width - size.width)),
          y: Math.max(0, Math.min(nextY, height - size.height)),
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    if (viewport.width && viewport.height) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [viewport, vel, isFrozen, isMobile, size]);

  // Randomize starting position and velocity
  useEffect(() => {
    if (!viewport.width || !viewport.height) return;
    const xMin = 0;
    const xMax = viewport.width - size.width;
    const yMin = 0;
    const yMax = viewport.height - size.height;
    const randX = xMin + Math.random() * Math.max(1, xMax - xMin);
    const randY = yMin + Math.random() * Math.max(1, yMax - yMin);
    setPos({ x: randX, y: randY });

    let vx = (Math.random() - 0.5) * 1.2;
    let vy = (Math.random() - 0.5) * 1.2;
    if (Math.abs(vx) < 0.2) vx = 0.4 * Math.sign(vx) || 0.4;
    if (Math.abs(vy) < 0.2) vy = 0.4 * Math.sign(vy) || 0.4;
    setVel({ x: vx, y: vy });
  }, [viewport.width, viewport.height, size.width, size.height]);

  return { pos, vel, elementRef, size };
}

// BouncingMessage component for user messages
function BouncingMessage({
  text,
  isFrozen,
  isMobile,
  zIndex = 9998,
}: {
  text: string;
  isFrozen: boolean;
  isMobile: boolean;
  zIndex?: number;
}) {
  const { pos, elementRef } = useBouncingElement(
    text,
    isFrozen,
    isMobile,
    zIndex
  );
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        fontSize: Math.round(32 * 0.9), // Match Sinhala logo size
        fontWeight: 400,
        color: "#fff",
        userSelect: "none",
        zIndex,
        textShadow: "0 2px 8px #000, 0 0 2px #fff",
        transition: "none",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: "8px 12px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      ref={elementRef}
    >
      {text}
    </div>
  );
}

// Control Panel Component
function ControlPanel({
  isFrozen,
  setIsFrozen,
  isHidden,
  setIsHidden,
}: {
  isFrozen: boolean;
  setIsFrozen: (frozen: boolean) => void;
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[10000] flex items-center gap-2">
      <Toggle
        pressed={isFrozen}
        onPressedChange={setIsFrozen}
        variant="outline"
        aria-label="Freeze logos"
      >
        <Snowflake className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isHidden}
        onPressedChange={setIsHidden}
        variant="outline"
        aria-label={isHidden ? "Show logos" : "Hide logos"}
      >
        {isHidden ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Toggle>
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const [isFrozen, setIsFrozen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; timestamp: number }>
  >([]);

  // Sinhala logo bouncing logic
  const sinhalaLogo = useBouncingElement("කල්චර්®", isFrozen, isMobile, 9999);

  // Handle message sending
  function handleSendMessage(message: string) {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }

  // Remove messages after 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages((prev) => prev.filter((msg) => now - msg.timestamp < 30000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Google Fonts for Sinhala */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* Control Panel */}
      <ControlPanel
        isFrozen={isFrozen}
        setIsFrozen={setIsFrozen}
        isHidden={isHidden}
        setIsHidden={setIsHidden}
      />
      {/* Debug: Show Sinhala K position and velocity (top left) */}
      <div
        className="fixed top-2 left-2 bg-black/70 text-white rounded-md z-[10000] font-mono pointer-events-none px-3 py-1 sm:text-[14px] text-[11px]"
        style={{
          fontSize: undefined, // handled by Tailwind
        }}
      >
        <div>
          කල්චර්® Position: x={sinhalaLogo.pos.x.toFixed(1)}, y=
          {sinhalaLogo.pos.y.toFixed(1)}
        </div>
        <div>
          කල්චර්® Velocity: vx={sinhalaLogo.vel.x.toFixed(3)}, vy=
          {sinhalaLogo.vel.y.toFixed(3)}
        </div>
      </div>
      {/* Bouncing Sinhala K in viewport */}
      {!isHidden && (
        <div
          style={{
            position: "fixed",
            left: sinhalaLogo.pos.x,
            top: sinhalaLogo.pos.y,
            fontSize: Math.round(32 * 0.9),
            fontWeight: 400,
            color: "#fff",
            userSelect: "none",
            zIndex: 9999,
            textShadow: "0 2px 8px #000, 0 0 2px #fff",
            transition: "none",
            fontFamily: "Noto Sans Sinhala",
          }}
          ref={sinhalaLogo.elementRef}
        >
          <span>
            කල්චර්
            <sup
              style={{
                fontSize: "0.6em",
                verticalAlign: "super",
                marginLeft: 2,
              }}
            >
              ®
            </sup>
          </span>
        </div>
      )}
      {/* Bouncing user messages */}
      {!isHidden &&
        messages.map((message) => (
          <BouncingMessage
            key={message.id}
            text={message.text}
            isFrozen={isFrozen}
            isMobile={isMobile}
            zIndex={9998}
          />
        ))}
      {/* Centered ChatInput */}
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md z-10">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
}
