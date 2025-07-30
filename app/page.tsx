"use client";

import Head from "next/head";
import { useRef, useState, useLayoutEffect } from "react";
import { Snowflake, Eye, EyeOff } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import ChatInput from "@/components/ChatInput";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { useScrollPrevention } from "@/hooks/useScrollPrevention";
import { useBoundsTracking } from "@/hooks/useBoundsTracking";
import { BouncingLogo } from "@/components/bouncingLogo";
import { BouncingMessage } from "@/components/BouncingMessage";
import { ControlPanel } from "@/components/ControlPanel";
import { DebugInfo } from "@/components/DebugInfo";
import type { Message, Bounds } from "@/types/bouncing";

export default function HomePage() {
  const isMobile = useIsMobile();

  // UI State
  const [isFrozen, setIsFrozen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [spawnKey, setSpawnKey] = useState(0);

  // Messages
  const [messages, setMessages] = useState<Message[]>([]);

  // Refs
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  useViewportHeight(isMobile);
  const { chatBounds, inputBounds } = useBoundsTracking(
    chatAreaRef,
    chatInputRef
  );
  useScrollPrevention(isMobile, messages.length);

  // Respawn elements when input bounds change
  useLayoutEffect(() => {
    if (inputBounds?.width) {
      setSpawnKey((prev) => prev + 1);
    }
  }, [inputBounds]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, newMessage];

      if (isMobile) {
        // Handle mobile viewport adjustments
        setTimeout(() => {
          window.scrollTo(0, 0);
          const vh = window.innerHeight;
          document.documentElement.style.setProperty("--app-vh", `${vh}px`);
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
          document.body.style.height = `${vh}px`;
          void document.body.offsetHeight;
        }, 0);
      }

      return newMessages;
    });
  };

  const handleToggleFreeze = () => setIsFrozen((prev) => !prev);
  const handleToggleVisibility = () => setIsHidden((prev) => !prev);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <ControlPanel
        isFrozen={isFrozen}
        onToggleFreeze={handleToggleFreeze}
        isHidden={isHidden}
        onToggleVisibility={handleToggleVisibility}
      />

      <DebugInfo messages={messages} className="hidden sm:block" />

      {!isHidden && (
        <>
          <BouncingLogo
            key={`sinhala-${spawnKey}`}
            isFrozen={isFrozen}
            isMobile={isMobile}
            inputBounds={inputBounds}
            respawnSignal={spawnKey}
          />

          {chatBounds &&
            inputBounds &&
            messages.map((message) => (
              <BouncingMessage
                key={`${message.id}-${spawnKey}`}
                message={message}
                isFrozen={isFrozen}
                isMobile={isMobile}
                chatBounds={chatBounds}
                inputBounds={inputBounds}
                respawnSignal={spawnKey}
              />
            ))}
        </>
      )}

      <div
        className="flex items-center justify-center w-full"
        style={{ minHeight: "var(--app-vh)" }}
      >
        <div
          ref={chatAreaRef}
          className="w-full max-w-md z-10 border border-[#f3f3f3] bg-transparent rounded-xl m-0 p-0 flex flex-col justify-center items-center relative overflow-hidden"
        >
          <div ref={chatInputRef} className="w-full">
            <ChatInput onSend={handleSendMessage} placeholder="Type anything" />
          </div>
        </div>
      </div>
    </>
  );
}
