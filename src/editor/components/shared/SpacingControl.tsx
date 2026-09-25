"use client";

import React, { useState } from "react";

interface SpacingItemProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  defaultUnit?: "rem" | "px";
}

export function SpacingSliderItem({
  label,
  value = "",
  onChange,
  defaultUnit = "rem",
}: SpacingItemProps) {
  // Parse value and unit
  const parseVal = (valStr: string) => {
    if (!valStr || typeof valStr !== "string") {
      return { num: 0, unit: defaultUnit };
    }
    const trimmed = valStr.trim();
    if (trimmed.endsWith("rem")) {
      return { num: parseFloat(trimmed) || 0, unit: "rem" as const };
    }
    if (trimmed.endsWith("px")) {
      return { num: parseFloat(trimmed) || 0, unit: "px" as const };
    }
    const n = parseFloat(trimmed);
    if (!isNaN(n)) {
      return { num: n, unit: defaultUnit };
    }
    return { num: 0, unit: defaultUnit };
  };

  const { num, unit } = parseVal(value);
  const [preferredUnit, setPreferredUnit] = useState<"rem" | "px">(unit);

  const activeUnit = value ? unit : preferredUnit;

  // Configuration based on active unit
  const isRem = activeUnit === "rem";
  const min = 0;
  const max = isRem ? 8 : 128;
  const step = isRem ? 0.25 : 4;

  const currentVal = isRem
    ? unit === "px" ? Math.round((num / 16) * 4) / 4 : num
    : unit === "rem" ? Math.round(num * 16) : num;

  const pct = Math.min(100, Math.max(0, ((currentVal - min) / (max - min)) * 100));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = parseFloat(e.target.value);
    onChange(`${nextVal}${activeUnit}`);
  };

  const toggleUnit = () => {
    const nextUnit = activeUnit === "rem" ? "px" : "rem";
    setPreferredUnit(nextUnit);
    if (activeUnit === "rem") {
      // rem -> px (1rem = 16px)
      onChange(`${Math.round(currentVal * 16)}px`);
    } else {
      // px -> rem (16px = 1rem)
      onChange(`${Math.round((currentVal / 16) * 4) / 4}rem`);
    }
  };

  const displayVal = value ? value : `${currentVal}${activeUnit}`;

  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="flex items-center justify-between">
        <label className="text-xs font-sans font-semibold text-brand-body dark:text-zinc-200">
          {label}
        </label>
        <button
          type="button"
          onClick={toggleUnit}
          title="Click to toggle unit between rem and px"
          className="font-mono text-xs text-brand-mute hover:text-brand-ink transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          {displayVal}
        </button>
      </div>
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentVal}
          onChange={handleSliderChange}
          className="spacing-range-slider w-full"
          style={{
            background: `linear-gradient(to right, #171717 ${pct}%, #e4e4e7 ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

interface SpacingControlProps {
  title?: string;
  topValue?: string;
  bottomValue?: string;
  horizontalValue?: string;
  leftValue?: string;
  rightValue?: string;
  onChangeTop?: (val: string) => void;
  onChangeBottom?: (val: string) => void;
  onChangeHorizontal?: (val: string) => void;
  onChangeLeft?: (val: string) => void;
  onChangeRight?: (val: string) => void;
  showHorizontal?: boolean;
}

export function SpacingControl({
  title = "Spacing",
  topValue = "",
  bottomValue = "",
  horizontalValue,
  leftValue,
  rightValue,
  onChangeTop,
  onChangeBottom,
  onChangeHorizontal,
  onChangeLeft,
  onChangeRight,
  showHorizontal = true,
}: SpacingControlProps) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <span className="font-sans font-bold text-xs uppercase tracking-wider text-brand-ink dark:text-white">
          {title}
        </span>
      )}

      {/* Top Padding */}
      {onChangeTop && (
        <SpacingSliderItem
          label="Top Padding"
          value={topValue}
          onChange={onChangeTop}
        />
      )}

      {/* Bottom Padding */}
      {onChangeBottom && (
        <SpacingSliderItem
          label="Bottom Padding"
          value={bottomValue}
          onChange={onChangeBottom}
        />
      )}

      {/* Horizontal / Side Padding */}
      {showHorizontal && onChangeHorizontal && (
        <SpacingSliderItem
          label="Horizontal (Side) Padding"
          value={horizontalValue ?? leftValue}
          onChange={(val) => {
            onChangeHorizontal?.(val);
            onChangeLeft?.(val);
            onChangeRight?.(val);
          }}
        />
      )}

      {/* Independent Left/Right if horizontal not provided */}
      {showHorizontal && !onChangeHorizontal && onChangeLeft && (
        <SpacingSliderItem
          label="Left Padding"
          value={leftValue}
          onChange={onChangeLeft}
        />
      )}
      {showHorizontal && !onChangeHorizontal && onChangeRight && (
        <SpacingSliderItem
          label="Right Padding"
          value={rightValue}
          onChange={onChangeRight}
        />
      )}
    </div>
  );
}
