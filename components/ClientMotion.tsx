"use client";

import { motion } from "framer-motion";
import React from "react";

// Simple wrapper that just passes all props through
export function MotionDiv(props: any) {
  return <motion.div {...props} />;
}

export function MotionHeading(props: any) {
  return <motion.h2 {...props} />;
}

// Change from p to div with paragraph styling
export function MotionParagraph(props: any) {
  const { className, ...otherProps } = props;
  return <motion.div className={`${className || ""} my-4`} {...otherProps} />;
}

export function MotionSpan(props: any) {
  return <motion.span {...props} />;
}

export function MotionSection(props: any) {
  return <motion.section {...props} />;
}

// Add text block component specifically for MDX content
export function MotionText(props: any) {
  const { className, ...otherProps } = props;
  return (
    <motion.div
      className={`${className || ""} my-4 leading-relaxed`}
      {...otherProps}
    />
  );
}
