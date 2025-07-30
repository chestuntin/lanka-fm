import { useBouncingElement } from "../hooks/useBouncingElement";
import { clampToViewport } from "../utils/viewport";
import type { Bounds } from "../types/bouncing";

interface BouncingLogoProps {
  isFrozen: boolean;
  isMobile: boolean;
  inputBounds?: Bounds | null;
  respawnSignal?: number;
}

export function BouncingLogo({
  isFrozen,
  isMobile,
  inputBounds,
  respawnSignal,
}: BouncingLogoProps) {
  const { pos, elementRef, size } = useBouncingElement(
    "කල්චර්®",
    isFrozen,
    isMobile,
    9999,
    undefined,
    inputBounds || undefined,
    respawnSignal,
    "sinhala-logo"
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
        zIndex: 9999,
        textShadow: "0 2px 8px #000, 0 0 2px #fff",
        transition: "none",
        fontFamily: "Noto Sans Sinhala",
        pointerEvents: "none",
        boxSizing: "border-box",
        paddingTop: "0.3em",
        margin: 0,
        lineHeight: 1,
        display: "inline-block",
      }}
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
  );
}
