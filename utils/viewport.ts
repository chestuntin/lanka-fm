import type { Position, Size, Bounds } from "@/types/bouncing";

/**
 * Get safe viewport dimensions that won't cause scrollbars
 */
export function getSafeViewportDimensions() {
  if (typeof window === "undefined") return { width: 0, height: 0 };

  const width = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth || window.innerWidth
  );
  const height = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight || window.innerHeight
  );

  return { width, height };
}

/**
 * Clamp position to viewport bounds
 */
export function clampToViewport(x: number, y: number, size: Size): Position {
  if (typeof window === "undefined") return { x, y };
  
  const { width: vw, height: vh } = getSafeViewportDimensions();
  
  return {
    x: Math.max(0, Math.min(x, vw - size.width)),
    y: Math.max(0, Math.min(y, vh - size.height)),
  };
}

/**
 * Get random spawn position outside input area (only above/below)
 */
export function getRandomPositionOutsideInput(
  size: Size,
  inputBounds?: Bounds,
  viewportDimensions?: { width: number; height: number }
): Position {
  if (typeof window === "undefined") return { x: 0, y: 0 };

  const { width: vw, height: vh } = viewportDimensions || getSafeViewportDimensions();

  if (!inputBounds) {
    return {
      x: Math.max(0, Math.min(Math.random() * (vw - size.width), vw - size.width)),
      y: Math.max(0, Math.min(Math.random() * (vh - size.height), vh - size.height)),
    };
  }

  // Only allow spawning above and below input box
  const regions = [
    {
      xMin: 0,
      xMax: Math.max(0, vw - size.width),
      yMin: 0,
      yMax: Math.max(0, inputBounds.top - size.height),
    },
    {
      xMin: 0,
      xMax: Math.max(0, vw - size.width),
      yMin: inputBounds.top + inputBounds.height,
      yMax: Math.max(inputBounds.top + inputBounds.height, vh - size.height),
    },
  ].filter((r) => r.xMax > r.xMin && r.yMax > r.yMin);

  if (!regions.length) {
    // Fallback to safe center position
    return {
      x: Math.max(0, Math.min((vw - size.width) / 2, vw - size.width)),
      y: Math.max(0, Math.min((vh - size.height) / 2, vh - size.height)),
    };
  }

  const region = regions[Math.floor(Math.random() * regions.length)];
  
  return {
    x: Math.max(0, Math.min(
      region.xMin + Math.random() * (region.xMax - region.xMin),
      vw - size.width
    )),
    y: Math.max(0, Math.min(
      region.yMin + Math.random() * (region.yMax - region.yMin),
      vh - size.height
    )),
  };
}