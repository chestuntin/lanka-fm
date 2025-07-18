"use client";
import { useState, useRef, useEffect } from "react";
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

  // Typewriter effect for placeholder
  const phrases = ["Type anything", "ටයිප් එනි තින්ග්"];
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (typing) {
      if (displayed.length < phrases[currentPhrase].length) {
        timeout = setTimeout(() => {
          setDisplayed(phrases[currentPhrase].slice(0, displayed.length + 1));
        }, 60);
      } else {
        setTimeout(() => {
          setFade(true);
          setTimeout(() => {
            setFade(false);
            setDisplayed("");
            setTyping(false);
            setTimeout(() => {
              setCurrentPhrase((p) => (p + 1) % phrases.length);
              setTyping(true);
            }, 3000);
          }, 600); // fade duration
        }, 1200);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, currentPhrase]);

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
        className="rounded-full text-muted-foreground h-9 w-9 min-w-0 min-h-0 mx-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/60 bg-white/5 backdrop-blur border border-white/10 hover:border-primary/40"
        aria-label="Add emoji"
        onClick={() => setShowEmoji((v) => !v)}
        tabIndex={-1}
      >
        <Smile className="w-5 h-5" />
      </Button>
      <div className="flex-1 flex items-center bg-white/5 backdrop-blur border border-white/10 hover:border-primary/40 focus-within:border-primary/60 shadow-lg rounded-full px-4 py-0 h-9 transition-all duration-200">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={displayed}
          className={`bg-transparent border-none focus:ring-0 focus-visible:ring-0 rounded-full text-white placeholder:text-muted-foreground/60 flex-1 shadow-none h-9 px-0 text-lg tracking-wide transition-opacity duration-500 ${
            fade ? "opacity-30" : "opacity-100"
          }`}
          autoComplete="off"
        />
      </div>
      <Button
        type="button"
        onClick={handleSend}
        size="icon"
        variant="ghost"
        className="rounded-full mx-2 text-muted-foreground h-9 w-9 min-w-0 min-h-0 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/60 bg-white/5 backdrop-blur border border-white/10 hover:border-primary/40 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
