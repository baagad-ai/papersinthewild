/**
 * Motion token mirror for JS-driven animation (BLOG-FLOW §5).
 *
 * globals.css carries the canonical CSS tokens (--motion-fast/base/slow,
 * --ease-out-soft). Motion's JS API takes seconds and cubic-bezier arrays,
 * so JS-driven components consume these mirrors instead of inventing
 * durations. Keep in sync with globals.css if the tokens ever move.
 */
export const MOTION_FAST = 0.12; // --motion-fast
export const MOTION_BASE = 0.4; // --motion-base
export const MOTION_SLOW = 0.7; // --motion-slow
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const; // --ease-out-soft
