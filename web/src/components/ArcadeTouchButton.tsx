"use client";

import type { PointerEvent } from "react";

/**
 * Shared on-screen control button for the arcade games' mobile touch
 * controls. Pointer events (not click) so hold-to-move buttons (paddle,
 * ship) can start/stop movement on press/release, same as a held key.
 */
export function ArcadeTouchButton({
  label,
  onPress,
  onRelease,
  className = "",
  "aria-label": ariaLabel,
}: {
  label: string;
  onPress: () => void;
  onRelease?: () => void;
  className?: string;
  "aria-label"?: string;
}) {
  const handleDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPress();
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={handleDown}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      onPointerCancel={onRelease}
      className={`border-paper text-paper active:bg-paper active:text-ink brutal-tag flex select-none items-center justify-center border-2 font-bold [touch-action:none] ${className}`}
    >
      {label}
    </button>
  );
}
