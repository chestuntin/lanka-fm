"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handleEmojiSelect(emojiData: EmojiClickData) {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newValue = message.slice(0, start) + emoji + message.slice(end);
    setMessage(newValue);
    setShowEmoji(false);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  }

  return (
    <div className="relative flex items-center gap-2 w-full px-2 py-2 bg-transparent">
      {/* Emoji Picker Popover */}
      {showEmoji && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            searchDisabled
            skinTonesDisabled
            height={350}
            width={320}
          />
        </div>
      )}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full text-muted-foreground h-12 w-12 min-w-0 min-h-0"
        aria-label="Add emoji"
        onClick={() => setShowEmoji((v) => !v)}
        tabIndex={-1}
      >
        <Smile className="w-6 h-6" />
      </Button>
      <div className="flex-1 flex items-center bg-[#18181b] border border-muted-foreground/20 rounded-full px-4 py-0 h-12">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent border-none focus:ring-0 focus-visible:ring-0 rounded-full text-white placeholder:text-muted-foreground flex-1 shadow-none h-12 px-0"
          autoComplete="off"
          style={{ height: 48 }}
        />
      </div>
      <Button
        type="button"
        onClick={handleSend}
        size="icon"
        variant="ghost"
        className="rounded-full ml-2 bg-muted text-muted-foreground hover:bg-muted/80 h-12 w-12 min-w-0 min-h-0"
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Send className="w-6 h-6" />
      </Button>
    </div>
  );
}
