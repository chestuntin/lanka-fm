"use client";

import { useState, ReactNode, useId } from "react";

interface TaskItemProps {
  checked: boolean; // We'll still accept this prop but ignore it for initial state
  children?: ReactNode;
  text?: string;
}

export function TaskItem({
  checked: initialChecked,
  children,
  text,
}: TaskItemProps) {
  // Always start unchecked, regardless of MDX state
  const [checked, setChecked] = useState(false);
  const id = useId();

  // Use either the children or the text prop for content
  const content = children || text || "";

  return (
    <li style={{ listStyleType: "none", marginBottom: "0.5rem" }}>
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "flex-start",
          cursor: "pointer",
        }}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          style={{
            marginRight: "0.5rem",
            marginTop: "0.25rem",
          }}
          className="w-5 h-5 accent-blue-500 cursor-pointer"
        />
        <span
          style={{
            textDecoration: checked ? "line-through" : "none",
            opacity: checked ? 0.7 : 1,
          }}
        >
          {content}
        </span>
      </label>
    </li>
  );
}
