"use client";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
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
  zIndex: number = 9999,
  boundaries?: { left: number; top: number; width: number; height: number },
  forbiddenRect?: { left: number; top: number; width: number; height: number },
  respawnSignal?: number
) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ x: 0.4, y: 0.4 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 48, height: 48 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Update viewport size (for Sinhala logo only)
  useEffect(() => {
    if (boundaries) return;
    function updateSize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [boundaries]);

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

  // Respawn logic
  const respawn = useCallback(() => {
    let left, top, width, height;
    if (boundaries) {
      left = boundaries.left;
      top = boundaries.top;
      width = boundaries.width;
      height = boundaries.height;
    } else {
      left = 0;
      top = 0;
      width = viewport.width;
      height = viewport.height;
    }
    if (!width || !height || (forbiddenRect && !forbiddenRect.width)) return;
    let spawnPos;
    if (forbiddenRect) {
      spawnPos = getRandomPositionOutsideInput(size, forbiddenRect);
    } else {
      const xMin = left;
      const xMax = left + width - size.width;
      const yMin = top;
      const yMax = top + height - size.height;
      spawnPos = {
        x: xMin + Math.random() * Math.max(1, xMax - xMin),
        y: yMin + Math.random() * Math.max(1, yMax - yMin),
      };
    }
    setPos(spawnPos);
    let vx = (Math.random() - 0.5) * 1.2;
    let vy = (Math.random() - 0.5) * 1.2;
    if (Math.abs(vx) < 0.2) vx = 0.4 * Math.sign(vx) || 0.4;
    if (Math.abs(vy) < 0.2) vy = 0.4 * Math.sign(vy) || 0.4;
    setVel({ x: vx, y: vy });
  }, [boundaries, forbiddenRect, size, viewport]);

  // Initial spawn and respawn on signal
  useEffect(() => {
    respawn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respawnSignal, size.width, size.height]);

  // Animation loop
  useEffect(() => {
    if (isFrozen) return;
    let animationFrame: number;
    function animate() {
      setPos((prev) => {
        let { x, y } = prev;
        let { x: vx, y: vy } = vel;
        let width, height, left, top;
        if (boundaries) {
          left = boundaries.left;
          top = boundaries.top;
          width = boundaries.width;
          height = boundaries.height;
        } else {
          left = 0;
          top = 0;
          width = viewport.width;
          height = viewport.height;
        }
        let nextX = x + vx * (isMobile ? 2 : 1);
        let nextY = y + vy * (isMobile ? 2 : 1);
        // Bounce off boundaries
        if (nextX + size.width >= left + width) {
          vx = -Math.abs(vx);
          nextX = left + width - size.width;
        } else if (nextX <= left) {
          vx = Math.abs(vx);
          nextX = left;
        }
        if (nextY + size.height >= top + height) {
          vy = -Math.abs(vy);
          nextY = top + height - size.height;
        } else if (nextY <= top) {
          vy = Math.abs(vy);
          nextY = top;
        }
        // Robust forbiddenRect bounce logic
        if (forbiddenRect) {
          const forbiddenLeft = forbiddenRect.left;
          const forbiddenRight = forbiddenRect.left + forbiddenRect.width;
          const forbiddenTop = forbiddenRect.top;
          const forbiddenBottom = forbiddenRect.top + forbiddenRect.height;

          // If the next position would be inside the forbidden area, bounce and move out
          const overlaps =
            nextX + size.width > forbiddenLeft &&
            nextX < forbiddenRight &&
            nextY + size.height > forbiddenTop &&
            nextY < forbiddenBottom;

          if (overlaps) {
            // Calculate distances to each edge
            const distLeft = Math.abs(nextX + size.width - forbiddenLeft);
            const distRight = Math.abs(nextX - forbiddenRight);
            const distTop = Math.abs(nextY + size.height - forbiddenTop);
            const distBottom = Math.abs(nextY - forbiddenBottom);

            // Find the closest edge and eject
            const minDist = Math.min(distLeft, distRight, distTop, distBottom);
            if (minDist === distLeft) {
              // Left edge
              nextX = forbiddenLeft - size.width;
              vx = -Math.abs(vx);
            } else if (minDist === distRight) {
              // Right edge
              nextX = forbiddenRight;
              vx = Math.abs(vx);
            } else if (minDist === distTop) {
              // Top edge
              nextY = forbiddenTop - size.height;
              vy = -Math.abs(vy);
            } else if (minDist === distBottom) {
              // Bottom edge
              nextY = forbiddenBottom;
              vy = Math.abs(vy);
            }
          }
        }
        setVel({ x: vx, y: vy });
        return {
          x: Math.max(left, Math.min(nextX, left + width - size.width)),
          y: Math.max(top, Math.min(nextY, top + height - size.height)),
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    if (
      (boundaries && boundaries.width && boundaries.height) ||
      (!boundaries && viewport.width && viewport.height)
    ) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [viewport, vel, isFrozen, isMobile, size, boundaries, forbiddenRect]);

  return { pos, vel, elementRef, size, respawn };
}

// Custom spawn logic: random position outside the chat input box
function getRandomPositionOutsideInput(
  size: { width: number; height: number },
  inputBounds?: { left: number; top: number; width: number; height: number }
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!inputBounds) {
    return {
      x: Math.random() * (vw - size.width),
      y: Math.random() * (vh - size.height),
    };
  }
  // Define the four regions
  const regions = [
    // Above
    {
      xMin: 0,
      xMax: vw - size.width,
      yMin: 0,
      yMax: Math.max(0, inputBounds.top - size.height),
    },
    // Below
    {
      xMin: 0,
      xMax: vw - size.width,
      yMin: inputBounds.top + inputBounds.height,
      yMax: vh - size.height,
    },
    // Left
    {
      xMin: 0,
      xMax: Math.max(0, inputBounds.left - size.width),
      yMin: inputBounds.top,
      yMax: inputBounds.top + inputBounds.height - size.height,
    },
    // Right
    {
      xMin: inputBounds.left + inputBounds.width,
      xMax: vw - size.width,
      yMin: inputBounds.top,
      yMax: inputBounds.top + inputBounds.height - size.height,
    },
  ].filter((r) => r.xMax > r.xMin && r.yMax > r.yMin);
  if (regions.length === 0) {
    // fallback: just use the whole viewport
    return {
      x: Math.random() * (vw - size.width),
      y: Math.random() * (vh - size.height),
    };
  }
  // Pick a random region, then a random point in that region
  const region = regions[Math.floor(Math.random() * regions.length)];
  return {
    x: region.xMin + Math.random() * (region.xMax - region.xMin),
    y: region.yMin + Math.random() * (region.yMax - region.yMin),
  };
}

// BouncingMessage component for user messages
function BouncingMessage({
  text,
  isFrozen,
  isMobile,
  zIndex = 9998,
  boundaries,
  forbiddenRect,
  respawnSignal,
}: {
  text: string;
  isFrozen: boolean;
  isMobile: boolean;
  zIndex?: number;
  boundaries?: { left: number; top: number; width: number; height: number };
  forbiddenRect?: { left: number; top: number; width: number; height: number };
  respawnSignal?: number;
}) {
  const { pos, elementRef } = useBouncingElement(
    text,
    isFrozen,
    isMobile,
    zIndex,
    boundaries,
    forbiddenRect,
    respawnSignal
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
        padding: "8px 12px",
        borderRadius: "20px",
        // border removed
      }}
      ref={elementRef}
    >
      {text}
      <sup style={{ fontSize: "0.6em", verticalAlign: "super", marginLeft: 2 }}>
        ®
      </sup>
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
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const [chatBounds, setChatBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [inputBounds, setInputBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [spawnKey, setSpawnKey] = useState(0);

  // When inputBounds changes, force respawn of all bouncing elements
  useEffect(() => {
    if (inputBounds && inputBounds.width) {
      setSpawnKey((k) => k + 1);
    }
  }, [
    inputBounds?.left,
    inputBounds?.top,
    inputBounds?.width,
    inputBounds?.height,
  ]);

  // Track chat area and input box boundaries
  useLayoutEffect(() => {
    function updateBounds() {
      if (chatAreaRef.current) {
        const rect = chatAreaRef.current.getBoundingClientRect();
        setChatBounds({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
      if (chatInputRef.current) {
        const rect = chatInputRef.current.getBoundingClientRect();
        setInputBounds({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Sinhala logo bouncing logic (now bounces off chat input box too)
  const sinhalaLogo = useBouncingElement(
    "කල්චර්®",
    isFrozen,
    isMobile,
    9999,
    undefined,
    inputBounds || undefined,
    spawnKey
  );

  // Handle message sending
  function handleSendMessage(message: string) {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }

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
          key={"sinhala-" + spawnKey}
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
      {/* Bouncing user messages inside chat area */}
      {!isHidden &&
        chatBounds &&
        inputBounds &&
        messages.map((message) => (
          <BouncingMessage
            key={message.id + "-" + spawnKey}
            text={message.text}
            isFrozen={isFrozen}
            isMobile={isMobile}
            zIndex={9998}
            forbiddenRect={inputBounds || undefined}
            respawnSignal={spawnKey}
          />
        ))}
      {/* Centered ChatInput with border and no padding */}
      <div className="flex items-center justify-center min-h-screen w-full">
        <div
          ref={chatAreaRef}
          className="w-full max-w-md z-10 border border-[\#f3f3f3] bg-transparent rounded-xl m-0 p-0 flex flex-col justify-center items-center relative overflow-hidden"
          style={{ boxSizing: "border-box" }}
        >
          <div ref={chatInputRef} className="w-full">
            <ChatInput onSend={handleSendMessage} placeholder="Type anything" />
          </div>
        </div>
      </div>
    </>
  );
}
