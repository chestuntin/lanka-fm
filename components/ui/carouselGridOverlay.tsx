import React, { useEffect, useState } from "react";

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
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function update() {
      if (carouselRef.current) {
        setRect(carouselRef.current.getBoundingClientRect());
      }
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [carouselRef]);

  if (!rect) return null;

  // Grid lines: vertical at left/right, horizontal at top/bottom of carousel
  const lines = [
    // Vertical lines
    {
      key: "left",
      style: {
        position: "fixed" as const,
        top: 0,
        left: rect.left,
        width: 2,
        height: viewport.height,
        background: "#39FF14",
        zIndex: 10001,
        pointerEvents: "none" as const,
      },
    },
    {
      key: "right",
      style: {
        position: "fixed" as const,
        top: 0,
        left: rect.right - 2,
        width: 2,
        height: viewport.height,
        background: "#39FF14",
        zIndex: 10001,
        pointerEvents: "none" as const,
      },
    },
    // Horizontal lines
    {
      key: "top",
      style: {
        position: "fixed" as const,
        left: 0,
        top: rect.top,
        width: viewport.width,
        height: 2,
        background: "#39FF14",
        zIndex: 10001,
        pointerEvents: "none" as const,
      },
    },
    {
      key: "bottom",
      style: {
        position: "fixed" as const,
        left: 0,
        top: rect.bottom - 2,
        width: viewport.width,
        height: 2,
        background: "#39FF14",
        zIndex: 10001,
        pointerEvents: "none" as const,
      },
    },
  ];

  // Section labels for all 9 regions
  const labels = [
    // Top row
    {
      key: "E",
      text: "E",
      style: {
        position: "fixed" as const,
        left: 8,
        top: rect.top - 28,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Top-left corner
    {
      key: "A",
      text: "A",
      style: {
        position: "fixed" as const,
        left: rect.left + 8,
        top: rect.top - 28,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Top gutter
    {
      key: "B",
      text: "B",
      style: {
        position: "fixed" as const,
        left: rect.right + 8,
        top: rect.top - 28,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Top-right corner
    // Middle row
    {
      key: "F",
      text: "F",
      style: {
        position: "fixed" as const,
        left: 8,
        top: rect.top + 32,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Left gutter
    {
      key: "I",
      text: "I",
      style: {
        position: "fixed" as const,
        left: rect.left + rect.width / 2 - 8,
        top: rect.top + rect.height / 2 - 8,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Center (carousel)
    {
      key: "H",
      text: "H",
      style: {
        position: "fixed" as const,
        left: rect.right + 8,
        top: rect.top + 32,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Right gutter
    // Bottom row
    {
      key: "G",
      text: "G",
      style: {
        position: "fixed" as const,
        left: 8,
        top: rect.bottom + 8,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Bottom-left corner
    {
      key: "C",
      text: "C",
      style: {
        position: "fixed" as const,
        left: rect.left + 8,
        top: rect.bottom + 8,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Bottom gutter
    {
      key: "D",
      text: "D",
      style: {
        position: "fixed" as const,
        left: rect.right + 8,
        top: rect.bottom + 8,
        color: "#39FF14",
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10002,
        pointerEvents: "none" as const,
      },
    }, // Bottom-right corner
  ];

  return (
    <>
      {lines.map((line) => (
        <div key={line.key} style={line.style} />
      ))}
      {labels.map((label) => (
        <div key={label.key} style={label.style}>
          {label.text}
        </div>
      ))}
    </>
  );
};
