import React, { useEffect, useRef, useState } from "react";

interface CarouselGridOverlayProps {
  carouselRef: React.RefObject<HTMLDivElement>;
}

// Section labels:
// E | A | F
// D | I | B
// G | C | H
const sectionLabels = [
  { key: "A", top: 0, left: "33.33%", label: "Top gutter" },
  { key: "B", top: "33.33%", right: 0, label: "Right gutter" },
  { key: "C", bottom: 0, left: "33.33%", label: "Bottom gutter" },
  { key: "D", top: "33.33%", left: 0, label: "Left gutter" },
  { key: "E", top: 0, left: 0, label: "Top left corner" },
  { key: "F", top: 0, right: 0, label: "Top right corner" },
  { key: "G", bottom: 0, left: 0, label: "Bottom left corner" },
  { key: "H", bottom: 0, right: 0, label: "Bottom right corner" },
  { key: "I", top: "33.33%", left: "33.33%", label: "Carousel area" },
];

export const CarouselGridOverlay: React.FC<CarouselGridOverlayProps> = ({
  carouselRef,
}) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    function updateRect() {
      if (carouselRef.current) {
        setRect(carouselRef.current.getBoundingClientRect());
      }
    }
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [carouselRef]);

  if (!rect) return null;

  // Overlay grid lines: top, right, bottom, left, and two lines each for horizontal/vertical thirds
  const gridLines = [
    // Borders
    { top: 0, left: 0, width: "100%", height: 2 }, // Top
    { top: 0, right: 0, width: 2, height: "100%" }, // Right
    { bottom: 0, left: 0, width: "100%", height: 2 }, // Bottom
    { top: 0, left: 0, width: 2, height: "100%" }, // Left
    // Thirds (horizontal)
    { top: "33.33%", left: 0, width: "100%", height: 1, dashed: true },
    { top: "66.66%", left: 0, width: "100%", height: 1, dashed: true },
    // Thirds (vertical)
    { top: 0, left: "33.33%", width: 1, height: "100%", dashed: true },
    { top: 0, left: "66.66%", width: 1, height: "100%", dashed: true },
  ];

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: rect.width,
        height: rect.height,
        zIndex: 10001,
      }}
    >
      {/* Grid lines */}
      {gridLines.map((line, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: line.top,
            left: line.left,
            right: line.right,
            bottom: line.bottom,
            width: line.width,
            height: line.height,
            background: "rgba(0,255,0,0.5)",
            borderRadius: 1,
            borderStyle: line.dashed ? "dashed" : "solid",
            borderWidth: line.dashed ? 0 : undefined,
            borderTop: line.dashed ? "1px dashed rgba(0,255,0,0.5)" : undefined,
            borderLeft: line.dashed
              ? "1px dashed rgba(0,255,0,0.5)"
              : undefined,
          }}
        />
      ))}
      {/* Section labels */}
      {sectionLabels.map((section) => (
        <div
          key={section.key}
          style={{
            position: "absolute",
            top: section.top,
            left: section.left,
            right: section.right,
            bottom: section.bottom,
            transform: "translate(-50%, -50%)",
            color: "#fff",
            background: "rgba(0,0,0,0.5)",
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 16,
            pointerEvents: "none",
            zIndex: 10002,
          }}
        >
          {section.key}
        </div>
      ))}
    </div>
  );
};
