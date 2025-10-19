// Type declarations for framer-motion
declare module "framer-motion" {
  export type AnimationControls = import("motion-dom").LegacyAnimationControls;
  export function useAnimation(): AnimationControls;
  export const motion: any;
  export const AnimatePresence: any;
}

// JSX namespace extension for styled-jsx
declare namespace JSX {
  interface IntrinsicElements {
    style: React.DetailedHTMLProps<
      React.StyleHTMLAttributes<HTMLStyleElement>,
      HTMLStyleElement
    > & {
      jsx?: boolean;
    };
  }
}
