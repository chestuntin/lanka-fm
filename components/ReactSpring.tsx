"use client";

import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";

export function BouncyBall() {
  // We'll store a numeric counter to force re-mount on each click
  const [resetCount, setResetCount] = useState(0);

  // This spring goes from y = -100 to y = 150
  // Every time the component mounts, it will animate once.
  const styles = useSpring({
    from: { y: -100 },
    to: { y: 150 },
    config: { tension: 200, friction: 10 },
    reset: true, // allows the same from->to each time
  });

  return (
    <div className="relative h-[200px] flex items-end justify-center">
      <animated.div
        key={resetCount} // changes when we increment `resetCount`
        style={styles}
        className="w-16 h-16 bg-red-500 rounded-full cursor-pointer shadow-lg"
        onClick={() => setResetCount((prev) => prev + 1)}
      />
    </div>
  );
}
