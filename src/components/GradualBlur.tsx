import { HTMLAttributes } from "react";

interface GradualBlurProps extends HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  className?: string;
}

export default function GradualBlur({
  position = "bottom",
  strength = 10,
  height = "6rem",
  width,
  className = "",
  ...props
}: GradualBlurProps) {
  const isVertical = position === "top" || position === "bottom";
  const finalWidth = width || (isVertical ? "100%" : height);
  const finalHeight = isVertical ? height : width || "100%";

  let maskImage = "";
  if (position === "top") {
    maskImage = "linear-gradient(to bottom, black 0%, transparent 100%)";
  } else if (position === "bottom") {
    maskImage = "linear-gradient(to top, black 0%, transparent 100%)";
  } else if (position === "left") {
    maskImage = "linear-gradient(to right, black 0%, transparent 100%)";
  } else if (position === "right") {
    maskImage = "linear-gradient(to left, black 0%, transparent 100%)";
  }

  return (
    <div
      className={`pointer-events-none fixed z-40 ${className}`}
      style={{
        height: finalHeight,
        width: finalWidth,
        top: position === "top" ? 0 : position === "bottom" ? "auto" : 0,
        bottom: position === "bottom" ? 0 : position === "top" ? "auto" : 0,
        left: position === "left" ? 0 : position === "right" ? "auto" : 0,
        right: position === "right" ? 0 : position === "left" ? "auto" : 0,
        backdropFilter: `blur(${strength}px)`,
        WebkitBackdropFilter: `blur(${strength}px)`,
        maskImage,
        WebkitMaskImage: maskImage,
        ...props.style,
      }}
      {...props}
    />
  );
}
