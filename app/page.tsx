"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

const MIXCLOUD_URL = "https://www.mixcloud.com/live/lankafm/";

const CHAR_SPEED = 10; // ms per character
const PAUSE_SPEED = 100; // ms pause between lines

interface UserInfo {
  ip: string;
  location: string;
  timezone: string;
  resolution: string;
}

const themes = ["amber", "green", "blue"];

/**
 * Checks if the current time in Sri Lanka (Asia/Colombo) is within the
 * restricted window (10:30 PM to 6:00 AM).
 * @returns {boolean} True if the time is within the restricted period, false otherwise.
 */
const isRestrictedTime = (): boolean => {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Colombo",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const parts = formatter.formatToParts(now);

    const hourPart = parts.find((part) => part.type === "hour");
    const minutePart = parts.find((part) => part.type === "minute");

    if (!hourPart || !minutePart) {
      console.error("Could not determine time in Asia/Colombo.");
      return false;
    }

    const hour = parseInt(hourPart.value, 10) % 24;
    const minute = parseInt(minutePart.value, 10);

    // Restriction is from 22:30 (10:30 PM) to 06:00 (6:00 AM)
    const isAfterStartTime = hour > 22 || (hour === 22 && minute >= 30);
    const isBeforeEndTime = hour < 6;

    return isAfterStartTime || isBeforeEndTime;
  } catch (error) {
    console.error("Error checking restricted time:", error);
    return false;
  }
};

export default function HomePage() {
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState("booting"); // booting, summary, countdown, cancelled, mobileNotice
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [theme, setTheme] = useState(themes[0]);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<number | null>(null);
  const preconnectAdded = useRef(false);

  // Check for mobile device on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobileCheck = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
        navigator.userAgent
      );
      setIsMobile(mobileCheck);
    }
  }, []);

  // Memoize the boot text so it's consistent across renders and accessible everywhere
  const bootText = useMemo(() => {
    if (!userInfo) return [];
    return [
      "> PWR ON: LANKA.FM BIOS v2.1",
      "> INITIATING STARLINK UPLINK...",
      "> SATELLITE HANDSHAKE... COMPLETE (SAT-8F2E)",
      "> ROUTING PACKETS...",
      "> SCANNING LOCAL NODE...",
      `> CLIENT IP      : ${userInfo.ip}`,
      `> CLIENT GEO     : ${userInfo.location}`,
      `> CLIENT TIMEZONE  : ${userInfo.timezone}`,
      `> CLIENT DISPLAY   : ${userInfo.resolution}`,
      "> SECURE CONNECTION ESTABLISHED.",
    ];
  }, [userInfo]);

  // Phase 1: Gather user information
  useEffect(() => {
    if (typeof window !== "undefined" && userInfo === null) {
      const info: UserInfo = {
        ip: "***.***.14.28", // Masked for privacy
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        resolution: `${window.screen.width}x${window.screen.height}`,
        location: "REQUESTING...",
      };

      navigator.geolocation.getCurrentPosition(
        () => {
          setUserInfo({ ...info, location: "[COORDINATES LOCKED]" });
        },
        () => {
          setUserInfo({ ...info, location: "[ACCESS DENIED]" });
        },
        { timeout: 5000 }
      );
      setUserInfo(info);
    }
  }, [userInfo]);

  // Phase 2: Run typewriter effect for boot sequence
  useEffect(() => {
    if (!userInfo || status !== "booting" || bootText.length === 0) return;

    const timeouts: number[] = [];
    let lineIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (lineIndex >= bootText.length) {
        timeouts.push(window.setTimeout(() => setStatus("summary"), 500));
        return;
      }

      const currentLine = bootText[lineIndex];
      if (charIndex < currentLine.length) {
        setBootSequence((prev) => {
          const newSeq = [...prev];
          newSeq[lineIndex] = currentLine.substring(0, charIndex + 1);
          return newSeq;
        });
        charIndex++;
        timeouts.push(window.setTimeout(type, CHAR_SPEED));
      } else {
        lineIndex++;
        charIndex = 0;
        timeouts.push(window.setTimeout(type, PAUSE_SPEED));
      }
    };

    timeouts.push(window.setTimeout(type, 500));
    return () => timeouts.forEach(clearTimeout);
  }, [userInfo, status, bootText]);

  // Phase 3: Transition from summary to countdown
  useEffect(() => {
    if (status === "summary") {
      const transitionTimer = window.setTimeout(() => {
        setStatus("countdown");
      }, 2000);
      return () => clearTimeout(transitionTimer);
    }
  }, [status]);

  // Countdown timer logic with preconnect warm-up
  useEffect(() => {
    if (status !== "countdown") return;

    timerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        // Warm up connection to Mixcloud when 3 seconds remain so redirect feels snappy
        if (
          prev === 3 &&
          !preconnectAdded.current &&
          typeof document !== "undefined"
        ) {
          try {
            const linkPre = document.createElement("link");
            linkPre.rel = "preconnect";
            linkPre.href = "https://www.mixcloud.com";
            linkPre.crossOrigin = "anonymous";
            document.head.appendChild(linkPre);

            const linkDns = document.createElement("link");
            linkDns.rel = "dns-prefetch";
            linkDns.href = "https://www.mixcloud.com";
            document.head.appendChild(linkDns);

            preconnectAdded.current = true;
            console.log(
              JSON.stringify({
                ts: Date.now(),
                event: "preconnect_added",
                host: "mixcloud.com",
              })
            );
          } catch (err) {
            console.warn("preconnect failed", err);
          }
        }

        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);

          const mobileShouldBeBlocked = isMobile && isRestrictedTime();
          console.log(
            JSON.stringify({
              ts: Date.now(),
              event: "countdown_end_check",
              mobile: isMobile,
              restrictedTime: isRestrictedTime(),
              block: mobileShouldBeBlocked,
            })
          );

          if (mobileShouldBeBlocked) {
            setStatus("mobileNotice");
            return 0;
          }
          // Desktop: redirect to Mixcloud
          window.location.href = MIXCLOUD_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, isMobile]);

  // Cancellation logic
  useEffect(() => {
    const handleCancel = () => {
      if (status === "countdown") {
        setStatus("cancelled");
      }
    };
    window.addEventListener("click", handleCancel);
    window.addEventListener("keydown", handleCancel);
    return () => {
      window.removeEventListener("click", handleCancel);
      window.removeEventListener("keydown", handleCancel);
    };
  }, [status]);

  const restartCountdown = () => {
    setCountdown(5);
    setStatus("countdown");
  };

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const renderContent = () => {
    if (status === "booting") {
      const currentLineIndex =
        bootSequence.length > 0 ? bootSequence.length - 1 : 0;

      return (
        <div className="booting-content">
          {bootText.map((line, index) => (
            <p key={index}>
              {bootSequence[index] || ""}
              {index === currentLineIndex &&
                bootSequence[index]?.length === line.length && (
                  <span className="blinking-cursor"></span>
                )}
            </p>
          ))}
        </div>
      );
    }

    if (status === "summary") {
      return (
        <pre className="boot-summary">
          {`+---------------------------------+\n`}
          {`|      SYSTEM BOOT COMPLETE       |\n`}
          {`+---------------------------------+\n`}
          {`| Status:          ALL SYSTEMS GO |\n`}
          {`| Live Feed:       ONLINE         |\n`}
          {`| Uplink:          STARLINK       |\n`}
          {`| Init Live Stream in T-${countdown}...      |\n`}
          {`+---------------------------------+`}
        </pre>
      );
    }

    if (status === "mobileNotice") {
      return (
        <div className="standby-content">
          <div className="status-indicator">AFTER HOURS</div>
          <h1 className="welcome-text">LANKA.FM</h1>
          <p className="cancelled-subtitle after-hours-title">
            Mobile Stream Unavailable
          </p>
          <div className="cancelled-actions" style={{ textAlign: "left" }}>
            <p className="notice-paragraph fade-in">
              Our broadcast isn’t meant for phones during these hours. <br />
              Tune in from your desktop when the night feels right. <br />
              <span className="site-link">It’s www.lanka.fm</span>
            </p>

            <div className="reconnect-prompt">
              <span>&gt; </span>
              <button
                className="cmd-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  restartCountdown();
                }}
              >
                [RETRY CONNECTION]
              </button>
            </div>

            <div className="reconnect-prompt">
              <span>&gt; </span>
              <button
                className="cmd-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
              >
                [ CYCLE THEME ]
              </button>
              <span className="blinking-cursor"></span>
            </div>
          </div>
        </div>
      );
    }

    if (status === "cancelled") {
      return (
        <div className="standby-content">
          <div className="status-indicator">AFTER HOURS</div>
          <h1 className="welcome-text">LANKA.FM</h1>
          <p className="cancelled-subtitle">Connection Terminated.</p>
          <div className="cancelled-actions">
            <div className="reconnect-prompt">
              <span>&gt; </span>
              <button
                className="cmd-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  restartCountdown();
                }}
              >
                [RE-ESTABLISH LINK]
              </button>
              <span className="blinking-cursor"></span>
            </div>
            <div className="reconnect-prompt">
              <span>&gt; </span>
              <button
                className="cmd-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
              >
                [ CYCLE THEME ]
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (status === "countdown") {
      return (
        <div className="countdown-content">
          <div className="status-indicator">LIVE FEED</div>
          <h1 className="welcome-text">LANKA.FM</h1>
          <div className="countdown">{countdown}</div>
          <p className="instruction-text">
            Click or press any key to abort.
            <span className="blinking-cursor"></span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="crt-container" data-theme={theme}>
      <div className="tv-bezel">
        <div className="tv-screen">{renderContent()}</div>
      </div>
    </div>
  );
}
