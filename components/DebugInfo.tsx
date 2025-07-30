import { useBouncingElement } from "@/hooks/useBouncingElement";
import type { Message } from "@/types/bouncing";

interface DebugInfoProps {
  messages: Message[];
  className?: string;
}

// This is a simplified version since we can't easily access the Sinhala logo's position
// In a real implementation, you might want to pass the logo's position as props
export function DebugInfo({ messages, className }: DebugInfoProps) {
  // For demo purposes, we'll create a mock bouncing element to show debug info
  const mockElement = useBouncingElement("debug", false, false);

  return (
    <div className={`fixed top-2 left-2 bg-black/70 text-white rounded-md z-[10000] font-mono pointer-events-none px-3 py-1 text-[11px] ${className}`}>
      <div>
        කල්චර්® Position: x={mockElement.pos.x.toFixed(1)}, y={mockElement.pos.y.toFixed(1)}
      </div>
      <div>
        කල්චර්® Velocity: vx={mockElement.vel.x.toFixed(3)}, vy={mockElement.vel.y.toFixed(3)}
      </div>
      <div>Active Elements: {messages.length + 1}</div>
    </div>
  );
}