import { Toggle } from "@/components/ui/toggle";
import { Snowflake, Eye, EyeOff } from "lucide-react";

interface ControlPanelProps {
  isFrozen: boolean;
  onToggleFreeze: () => void;
  isHidden: boolean;
  onToggleVisibility: () => void;
}

export function ControlPanel({
  isFrozen,
  onToggleFreeze,
  isHidden,
  onToggleVisibility,
}: ControlPanelProps) {
  return (
    <div className="fixed top-4 right-4 z-[10000] flex items-center gap-2">
      <Toggle
        pressed={isFrozen}
        onPressedChange={onToggleFreeze}
        variant="outline"
        aria-label="Freeze logos"
      >
        <Snowflake className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        pressed={isHidden}
        onPressedChange={onToggleVisibility}
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