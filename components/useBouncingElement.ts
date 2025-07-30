import { useRef, useEffect, useState, useCallback } from "react";
import type { Position, Velocity, Size, Bounds } from "@/types/bouncing";
import { getSafeViewportDimensions, getRandomPositionOutsideInput } from "@/utils/viewport";

export function useBouncingElement(
  content: string,
  isFrozen: boolean,
  isMobile: boolean,
  zIndex: number = 9999,
  boundaries?: Bounds,
  forbiddenRect?: Bounds,
  respawnSignal?: number,
  elementId?: string
) {
  const [pos, setPos] = useState<Position>({ x: 50, y: 50 });
  const [vel, setVel] = useState<Velocity>({ x: 0.4, y: 0.4 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState<Size>({ width: 48, height: 48 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Update viewport size (for elements without boundaries)
  useEffect(() => {
    if (boundaries) return;
    
    function updateSize() {
      const safeDimensions = getSafeViewportDimensions();
      setViewport(safeDimensions);
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
      const safeDimensions = getSafeViewportDimensions();
      left = 0;
      top = 0;
      width = safeDimensions.width;
      height = safeDimensions.height;
    }

    if (!width || !height || (forbiddenRect && !forbiddenRect.width)) return;

    let spawnPos: Position;
    
    if (forbiddenRect) {
      spawnPos = getRandomPositionOutsideInput(size, forbiddenRect, { width, height });
    } else {
      const xMin = left;
      const xMax = left + width - size.width;
      const yMin = top;
      const yMax = top + height - size.height;
      
      spawnPos = {
        x: Math.max(xMin, Math.min(xMin + Math.random() * Math.max(1, xMax - xMin), xMax)),
        y: Math.max(yMin, Math.min(yMin + Math.random() * Math.max(1, yMax - yMin), yMax)),
      };
    }

    // Ensure spawn position is within safe bounds
    const safeDimensions = getSafeViewportDimensions();
    spawnPos.x = Math.max(0, Math.min(spawnPos.x, safeDimensions.width - size.width));
    spawnPos.y = Math.max(0, Math.min(spawnPos.y, safeDimensions.height - size.height));

    setPos(spawnPos);
    
    // Set random velocity
    let vx = (Math.random() - 0.5) * 1.2;
    let vy = (Math.random() - 0.5) * 1.2;
    if (Math.abs(vx) < 0.2) vx = 0.4 * Math.sign(vx) || 0.4;
    if (Math.abs(vy) < 0.2) vy = 0.4 * Math.sign(vy) || 0.4;
    
    setVel({ x: vx, y: vy });
  }, [boundaries, forbiddenRect, size, viewport]);

  // Initial spawn and respawn on signal
  useEffect(() => {
    respawn();
  }, [respawnSignal, size.width, size.height, respawn]);

  // Animation loop
  useEffect(() => {
    if (isFrozen) return;
    
    let animationFrame: number;

    function animate() {
      setPos((prevPos) => {
        let { x, y } = prevPos;
        let { x: vx, y: vy } = vel;
        let width, height, left, top;

        if (boundaries) {
          left = boundaries.left;
          top = boundaries.top;
          width = boundaries.width;
          height = boundaries.height;
        } else {
          const safeDimensions = getSafeViewportDimensions();
          left = 0;
          top = 0;
          width = safeDimensions.width;
          height = safeDimensions.height;
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

        // Bounce off forbidden rectangle (input box)
        if (forbiddenRect) {
          const inputLeft = forbiddenRect.left;
          const inputRight = forbiddenRect.left + forbiddenRect.width;
          const inputTop = forbiddenRect.top;
          const inputBottom = forbiddenRect.top + forbiddenRect.height;

          const overlapsX = nextX + size.width > inputLeft && nextX < inputRight;
          const overlapsY = nextY + size.height > inputTop && nextY < inputBottom;

          if (overlapsX && overlapsY) {
            const distToLeft = Math.abs(nextX + size.width - inputLeft);
            const distToRight = Math.abs(nextX - inputRight);
            const distToTop = Math.abs(nextY + size.height - inputTop);
            const distToBottom = Math.abs(nextY - inputBottom);

            const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

            if (minDist === distToLeft) {
              nextX = inputLeft - size.width;
              vx = -Math.abs(vx);
            } else if (minDist === distToRight) {
              nextX = inputRight;
              vx = Math.abs(vx);
            } else if (minDist === distToTop) {
              nextY = inputTop - size.height;
              vy = -Math.abs(vy);
            } else if (minDist === distToBottom) {
              nextY = inputBottom;
              vy = Math.abs(vy);
            }
          }
        }

        setVel({ x: vx, y: vy });

        // Ensure final position stays within safe bounds
        const safeDimensions = getSafeViewportDimensions();
        return {
          x: Math.max(0, Math.min(nextX, safeDimensions.width - size.width)),
          y: Math.max(0, Math.min(nextY, safeDimensions.height - size.height)),
        };
      });
      
      animationFrame = requestAnimationFrame(animate);
    }

    const shouldAnimate = (boundaries && boundaries.width && boundaries.height) || 
                         (!boundaries && viewport.width && viewport.height);
    
    if (shouldAnimate) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [viewport, vel, isFrozen, isMobile, size, boundaries, forbiddenRect, elementId]);

  return { pos, vel, elementRef, size, respawn };
}