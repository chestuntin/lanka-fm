"use client";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import Head from "next/head";
import { Snowflake, Eye, EyeOff } from "lucide-react";
import ChatInput from "@/components/ChatInput";

// Type for a bouncing element
type BouncingElement = {
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  size: { width: number; height: number };
  setPos: (pos: { x: number; y: number }) => void;
  setVel: (vel: { x: number; y: number }) => void;
};

// Global collision manager context
interface CollisionManager {
  elements: Map<string, BouncingElement>;
  registerElement: (id: string, element: BouncingElement) => void;
  unregisterElement: (id: string) => void;
  checkCollisions: () => void;
}

const CollisionContext = createContext<CollisionManager | null>(null);

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

// Improved collision detection with better separation
function detectCollision(
  pos1: { x: number; y: number },
  size1: { width: number; height: number },
  pos2: { x: number; y: number },
  size2: { width: number; height: number }
): boolean {
  return (
    pos1.x < pos2.x + size2.width &&
    pos1.x + size1.width > pos2.x &&
    pos1.y < pos2.y + size2.height &&
    pos1.y + size1.height > pos2.y
  );
}

// Enhanced collision tracking with shorter cooldown
const collisionCooldowns = new Map<string, number>();

// Reduced cooldown for more responsive collisions
function canCollide(id1: string, id2: string): boolean {
  const pairKey = [id1, id2].sort().join("-");
  const now = performance.now();
  const lastCollision = collisionCooldowns.get(pairKey) || 0;

  // Reduced cooldown to 50ms for more responsive collisions
  if (now - lastCollision < 50) {
    return false;
  }

  return true;
}

function recordCollision(id1: string, id2: string) {
  const pairKey = [id1, id2].sort().join("-");
  collisionCooldowns.set(pairKey, performance.now());
}

// Completely rewritten collision handling for smooth physics
function handleElementCollision(
  elem1: BouncingElement,
  elem2: BouncingElement,
  elem1Id: string,
  elem2Id: string
) {
  // Calculate centers
  const center1 = {
    x: elem1.pos.x + elem1.size.width / 2,
    y: elem1.pos.y + elem1.size.height / 2,
  };
  const center2 = {
    x: elem2.pos.x + elem2.size.width / 2,
    y: elem2.pos.y + elem2.size.height / 2,
  };

  // Calculate distance and overlap
  const dx = center2.x - center1.x;
  const dy = center2.y - center1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Prevent division by zero
  if (distance === 0) {
    // If elements are exactly on top of each other, separate them randomly
    const angle = Math.random() * Math.PI * 2;
    const separationDistance = Math.max(elem1.size.width, elem1.size.height) / 2 + 2;
    
    elem1.setPos({
      x: elem1.pos.x - Math.cos(angle) * separationDistance,
      y: elem1.pos.y - Math.sin(angle) * separationDistance
    });
    elem2.setPos({
      x: elem2.pos.x + Math.cos(angle) * separationDistance,
      y: elem2.pos.y + Math.sin(angle) * separationDistance
    });
    
    // Set opposite velocities
    const speed = 1.0;
    elem1.setVel({
      x: -Math.cos(angle) * speed,
      y: -Math.sin(angle) * speed
    });
    elem2.setVel({
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    });
    
    recordCollision(elem1Id, elem2Id);
    return;
  }

  // Normalize collision vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Calculate minimum separation distance
  const combinedHalfWidths = (elem1.size.width + elem2.size.width) / 2;
  const combinedHalfHeights = (elem1.size.height + elem2.size.height) / 2;
  
  // Use the smaller dimension for more accurate collision
  const minSeparation = Math.min(combinedHalfWidths, combinedHalfHeights);
  const overlap = minSeparation - distance;
  
  if (overlap > 0) {
    // Separate the elements with extra padding to prevent sticking
    const separationDistance = overlap / 2 + 2; // Extra 2px padding
    
    const newPos1 = {
      x: elem1.pos.x - nx * separationDistance,
      y: elem1.pos.y - ny * separationDistance
    };
    const newPos2 = {
      x: elem2.pos.x + nx * separationDistance,
      y: elem2.pos.y + ny * separationDistance
    };
    
    elem1.setPos(newPos1);
    elem2.setPos(newPos2);
  }

  // Calculate relative velocity
  const relativeVelX = elem2.vel.x - elem1.vel.x;
  const relativeVelY = elem2.vel.y - elem1.vel.y;
  
  // Calculate relative velocity along collision normal
  const relativeSpeed = relativeVelX * nx + relativeVelY * ny;
  
  // Don't resolve if velocities are separating
  if (relativeSpeed > 0) {
    recordCollision(elem1Id, elem2Id);
    return;
  }
  
  // Calculate restitution (bounciness) - slightly less than 1 for more realistic physics
  const restitution = 0.95;
  
  // Calculate impulse scalar
  const impulse = -(1 + restitution) * relativeSpeed;
  
  // Apply impulse to velocities (assuming equal mass)
  const impulseX = impulse * nx;
  const impulseY = impulse * ny;
  
  // Update velocities with some damping to prevent infinite energy
  const damping = 0.98;
  
  elem1.setVel({
    x: (elem1.vel.x - impulseX) * damping,
    y: (elem1.vel.y - impulseY) * damping
  });
  
  elem2.setVel({
    x: (elem2.vel.x + impulseX) * damping,
    y: (elem2.vel.y + impulseY) * damping
  });
  
  recordCollision(elem1Id, elem2Id);
}

// Collision Manager Provider
function CollisionProvider({ children }: { children: React.ReactNode }) {
  const elementsRef = useRef<Map<string, BouncingElement>>(new Map());

  const manager: CollisionManager = {
    elements: elementsRef.current,
    registerElement: (id: string, element: BouncingElement) => {
      elementsRef.current.set(id, element);
    },
    unregisterElement: (id: string) => {
      elementsRef.current.delete(id);
    },
    checkCollisions: () => {
      const elements = Array.from(elementsRef.current.entries());

      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const [id1, elem1] = elements[i];
          const [id2, elem2] = elements[j];

          // Check cooldown first
          if (!canCollide(id1, id2)) {
            continue;
          }

          const isColliding = detectCollision(
            elem1.pos,
            elem1.size,
            elem2.pos,
            elem2.size
          );

          if (isColliding) {
            handleElementCollision(elem1, elem2, id1, id2);
          }
        }
      }
    },
  };

  return (
    <CollisionContext.Provider value={manager}>
      {children}
    </CollisionContext.Provider>
  );
}

// Custom hook for bouncing elements with collision support
function useBouncingElement(
  content: string,
  isFrozen: boolean,
  isMobile: boolean,
  zIndex: number = 9999,
  boundaries?: { left: number; top: number; width: number; height: number },
  forbiddenRect?: { left: number; top: number; width: number; height: number },
  respawnSignal?: number,
  elementId?: string
) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [vel, setVel] = useState({ x: 0.4, y: 0.4 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 48, height: 48 });
  const elementRef = useRef<HTMLDivElement>(null);
  const collisionManager = useContext(CollisionContext);

  // Register with collision manager
  useEffect(() => {
    if (!collisionManager || !elementId) return;

    const element = {
      pos,
      vel,
      size,
      setPos,
      setVel,
    };

    collisionManager.registerElement(elementId, element);

    return () => {
      collisionManager.unregisterElement(elementId);
    };
  }, [collisionManager, elementId, pos, vel, size]);

  // Update viewport size (for Sinhala logo only)
  useEffect(() => {
    if (boundaries) return;
    function updateSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });
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
  }, [respawnSignal, size.width, size.height]);

  // Animation loop
  useEffect(() => {
    if (isFrozen) return;
    let animationFrame: number;

    function animate() {
      // Check for collisions first
      if (collisionManager) {
        collisionManager.checkCollisions();
      }

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

        const speedMultiplier = isMobile ? 2 : 1;
        let nextX = x + vx * speedMultiplier;
        let nextY = y + vy * speedMultiplier;

        // Bounce off viewport edges
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

        // Forbidden area bounce
        if (forbiddenRect) {
          const fLeft = forbiddenRect.left;
          const fRight = forbiddenRect.left + forbiddenRect.width;
          const fTop = forbiddenRect.top;
          const fBottom = forbiddenRect.top + forbiddenRect.height;
          const overlaps =
            nextX + size.width > fLeft &&
            nextX < fRight &&
            nextY + size.height > fTop &&
            nextY < fBottom;
          if (overlaps) {
            const distLeft = Math.abs(nextX + size.width - fLeft);
            const distRight = Math.abs(nextX - fRight);
            const distTop = Math.abs(nextY + size.height - fTop);
            const distBottom = Math.abs(nextY - fBottom);
            const minDist = Math.min(distLeft, distRight, distTop, distBottom);
            if (minDist === distLeft) {
              nextX = fLeft - size.width;
              vx = -Math.abs(vx);
            } else if (minDist === distRight) {
              nextX = fRight;
              vx = Math.abs(vx);
            } else if (minDist === distTop) {
              nextY = fTop - size.height;
              vy = -Math.abs(vy);
            } else if (minDist === distBottom) {
              nextY = fBottom;
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
  }, [
    viewport,
    vel,
    isFrozen,
    isMobile,
    size,
    boundaries,
    forbiddenRect,
    collisionManager,
    elementId,
  ]);

  return { pos, vel, elementRef, size, respawn };
}

// Random spawn outside input
function getRandomPositionOutsideInput(
  size: { width: number; height: number },
  inputBounds?: { left: number; top: number; width: number; height: number }
) {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!inputBounds) {
    return {
      x: Math.random() * (vw - size.width),
      y: Math.random() * (vh - size.height),
    };
  }
  const regions = [
    {
      xMin: 0,
      xMax: vw - size.width,
      yMin: 0,
      yMax: inputBounds.top - size.height,
    },
    {
      xMin: 0,
      xMax: vw - size.width,
      yMin: inputBounds.top + inputBounds.height,
      yMax: vh - size.height,
    },
    {
      xMin: 0,
      xMax: inputBounds.left - size.width,
      yMin: inputBounds.top,
      yMax: inputBounds.top + inputBounds.height - size.height,
    },
    {
      xMin: inputBounds.left + inputBounds.width,
      xMax: vw - size.width,
      yMin: inputBounds.top,
      yMax: inputBounds.top + inputBounds.height - size.height,
    },
  ].filter((r) => r.xMax > r.xMin && r.yMax > r.yMin);
  if (!regions.length)
    return {
      x: Math.random() * (vw - size.width),
      y: Math.random() * (vh - size.height),
    };
  const region = regions[Math.floor(Math.random() * regions.length)];
  return {
    x: region.xMin + Math.random() * (region.xMax - region.xMin),
    y: region.yMin + Math.random() * (region.yMax - region.yMin),
  };
}

function clampToViewport(
  x: number,
  y: number,
  size: { width: number; height: number }
) {
  if (typeof window === "undefined") return { x, y };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.max(0, Math.min(x, vw - size.width)),
    y: Math.max(0, Math.min(y, vh - size.height)),
  };
}

// BouncingMessage component
function BouncingMessage({
  text,
  isFrozen,
  isMobile,
  zIndex = 9998,
  boundaries,
  forbiddenRect,
  respawnSignal,
  messageId,
}: {
  text: string;
  isFrozen: boolean;
  isMobile: boolean;
  zIndex?: number;
  boundaries?: { left: number; top: number; width: number; height: number };
  forbiddenRect?: { left: number; top: number; width: number; height: number };
  respawnSignal?: number;
  messageId: string;
}) {
  const { pos, elementRef, size } = useBouncingElement(
    text,
    isFrozen,
    isMobile,
    zIndex,
    boundaries,
    forbiddenRect,
    respawnSignal,
    messageId
  );
  const { x, y } = clampToViewport(pos.x, pos.y, size);

  return (
    <div
      ref={elementRef}
      style={{
        position: isMobile ? "absolute" : "fixed",
        left: x,
        top: y,
        fontSize: Math.round(32 * 0.9),
        fontWeight: 400,
        color: "#fff",
        userSelect: "none",
        zIndex,
        textShadow: "0 2px 8px #000, 0 0 2px #fff",
        transition: "none",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        pointerEvents: "none",
      }}
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
        )}{" "}
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
  const [initialViewportHeight, setInitialViewportHeight] = useState<number>(0);

  // Fixed viewport height management for mobile
  useEffect(() => {
    if (!isMobile) return;
    const initialHeight = window.innerHeight;
    setInitialViewportHeight(initialHeight);
    function handleViewportChange() {
      document.documentElement.style.setProperty(
        "--app-vh",
        `${initialHeight}px`
      );
    }
    handleViewportChange();
    let timeoutId: NodeJS.Timeout;
    function debouncedHandleViewportChange() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleViewportChange, 100);
    }
    window.addEventListener("resize", debouncedHandleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        debouncedHandleViewportChange
      );
    }
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedHandleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          debouncedHandleViewportChange
        );
      }
    };
  }, [isMobile]);

  // Desktop viewport handling
  useEffect(() => {
    if (isMobile) return;
    function setVh() {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${vh}px`);
    }
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, [isMobile]);

  // Respawn on inputBounds change
  useEffect(() => {
    if (inputBounds?.width) setSpawnKey((k) => k + 1);
  }, [inputBounds]);

  // Track chat area and input box boundaries
  useLayoutEffect(() => {
    function updateBounds() {
      if (chatAreaRef.current) {
        const rect = chatAreaRef.current.getBoundingClientRect();
        setChatBounds(rect);
      }
      if (chatInputRef.current) {
        const rect = chatInputRef.current.getBoundingClientRect();
        setInputBounds(rect);
      }
    }
    updateBounds();
    window.addEventListener("resize", () => setTimeout(updateBounds, 50));
    return () => window.removeEventListener("resize", () => {});
  }, []);

  // Sinhala logo bouncing
  const sinhalaLogo = useBouncingElement(
    "කල්චර්®",
    isFrozen,
    isMobile,
    9999,
    undefined,
    inputBounds || undefined,
    spawnKey,
    "sinhala-logo"
  );

  function handleSendMessage(message: string) {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => {
      const newMessages = [...prev, newMessage];
      if (isMobile) {
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.style.setProperty(
            "--app-vh",
            `${initialViewportHeight}px`
          );
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
          document.body.style.height = `${initialViewportHeight}px`;
          void document.body.offsetHeight;
        }, 0);
      }
      return newMessages;
    });
  }

  // Prevent scrolling on mobile
  useEffect(() => {
    if (!isMobile) return;
    const html = document.documentElement;
    const body = document.body;
    if (messages.length > 0) {
      html.style.overflow = "hidden";
      html.style.height = `${initialViewportHeight || window.innerHeight}px`;
      body.style.overflow = "hidden";
      body.style.height = `${initialViewportHeight || window.innerHeight}px`;
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.top = "0";
      body.style.left = "0";
    } else {
      html.style.overflow = "";
      html.style.height = "";
      body.style.overflow = "";
      body.style.height = "";
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
      body.style.left = "";
    }
    return () => {
      html.style.overflow = "";
      html.style.height = "";
      body.style.overflow = "";
      body.style.height = "";
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
      body.style.left = "";
    };
  }, [messages.length, isMobile, initialViewportHeight]);

  // Prevent touch scroll on logos
  useEffect(() => {
    const preventTouch = (e: TouchEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.closest("button")
      )
        return;
      e.preventDefault();
    };
    if (isMobile && messages.length > 0) {
      document.addEventListener("touchmove", preventTouch, { passive: false });
      document.addEventListener("touchstart", preventTouch, { passive: false });
    }
    return () => {
      document.removeEventListener("touchmove", preventTouch);
      document.removeEventListener("touchstart", preventTouch);
    };
  }, [isMobile, messages.length]);

  return (
    <CollisionProvider>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ControlPanel
        isFrozen={isFrozen}
        setIsFrozen={setIsFrozen}
        isHidden={isHidden}
        setIsHidden={setIsHidden}
      />
      {/* Debug info */}
      <div className="hidden sm:block fixed top-2 left-2 bg-black/70 text-white rounded-md z-[10000] font-mono pointer-events-none px-3 py-1 text-[11px]">
        <div>
          කල්චර්® Position: x={sinhalaLogo.pos.x.toFixed(1)}, y=
          {sinhalaLogo.pos.y.toFixed(1)}
        </div>
        <div>
          කල්චර්® Velocity: vx={sinhalaLogo.vel.x.toFixed(3)}, vy=
          {sinhalaLogo.vel.y.toFixed(3)}
        </div>
        <div>Active Elements: {messages.length + 1}</div>
      </div>
      {!isHidden && (
        <div
          key={"sinhala-" + spawnKey}
          style={{
            position: isMobile ? "absolute" : "fixed",
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
            pointerEvents: "none",
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
      {!isHidden &&
        chatBounds &&
        inputBounds &&
        messages.map((m) => (
          <BouncingMessage
            key={m.id + "-" + spawnKey}
            text={m.text}
            isFrozen={isFrozen}
            isMobile={isMobile}
            forbiddenRect={inputBounds}
            respawnSignal={spawnKey}
            messageId={m.id}
          />
        ))}
      <div
        className="flex items-center justify-center w-full"
        style={{ minHeight: "var(--app-vh)" }}
      >
        <div
          ref={chatAreaRef}
          className="w-full max-w-md z-10 border border-[#f3f3f3] bg-transparent rounded-xl m-0 p-0 flex flex-col justify-center items-center relative overflow-hidden"
          style={{
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            ref={chatInputRef}
            className="w-full"
            style={{
              outline: "2px dashed #f00",
              margin: 0,
              padding: 0,
            }}
          >
            <ChatInput onSend={handleSendMessage} placeholder="Type anything" />
          </div>
        </div>
      </div>
    </CollisionProvider>
  );
}
