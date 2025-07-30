import { useBouncingElement } from "@/hooks/useBouncingElement";
import { clampToViewport } from "@/utils/viewport";
import type { Message, Bounds } from "@/types/bouncing";

interface BouncingMessageProps {
  message: Message;
  isFrozen: boolean;
  isMobile: boolean;
  chatBounds: Bounds;
  inputBounds: Bounds;
  respawnSignal?: number;
  zIndex?: number;
}

export function BouncingMessage({
  message,
  isFrozen,
  isMobile,
  chatBounds,
  inputBounds,
  respawnSignal,
  zIndex = 9998,
}: BouncingMessageProps) {
  const { pos, elementRef, size } = useBouncingElement(
    message.text,
    isFrozen,
    isMobile,
    zIndex,
    chatBounds,
    inputBounds,
    respawnSignal,
    message.id
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
        boxSizing: "border-box",
        paddingTop: "0.3em",
        margin: 0,
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      {message.text}
      <sup style={{ fontSize: "0.6em", verticalAlign: "super", marginLeft: 2 }}>
        ®
      </sup>
    </div>
  );
}