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
        <div className="absolute bottom-full left-0 mb-3 z-50 rounded-xl shadow-2xl border border-neutral-800 bg-[#18181b]">
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
        className="rounded-full text-muted-foreground h-14 w-14 min-w-0 min-h-0 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/60 bg-white/5 backdrop-blur border border-white/10 hover:border-primary/40"
        aria-label="Add emoji"
        onClick={() => setShowEmoji((v) => !v)}
        tabIndex={-1}
      >
        <Smile className="w-7 h-7" />
      </Button>
      <div className="flex-1 flex items-center bg-white/5 backdrop-blur border border-white/10 hover:border-primary/40 focus-within:border-primary/60 shadow-lg rounded-full px-5 py-0 h-12 transition-all duration-200">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent border-none focus:ring-0 focus-visible:ring-0 rounded-full text-white placeholder:text-muted-foreground flex-1 shadow-none h-12 px-0 text-lg tracking-wide"
          autoComplete="off"
        />
      </div>
      <Button
        type="button"
        onClick={handleSend}
        size="icon"
        variant="ghost"
        className="rounded-full ml-2 bg-primary/80 text-white hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary/60 h-14 w-14 min-w-0 min-h-0 transition-transform hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed border border-primary/40"
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Send className="w-7 h-7" />
      </Button>
    </div>
  );
}
