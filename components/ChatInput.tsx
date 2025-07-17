"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (message.trim() === "") return;
    onSend?.(message);
    setMessage("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className="flex items-center gap-2 w-full px-2 py-2 bg-transparent">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full text-muted-foreground"
        aria-label="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </Button>
      <div className="flex-1 flex items-center bg-[#18181b] border border-muted-foreground/20 rounded-full px-4 py-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent border-none focus:ring-0 focus-visible:ring-0 rounded-full text-white placeholder:text-muted-foreground flex-1 shadow-none"
          autoComplete="off"
        />
      </div>
      <Button
        type="button"
        onClick={handleSend}
        size="icon"
        variant="ghost"
        className="rounded-full ml-2 bg-muted text-muted-foreground hover:bg-muted/80"
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
