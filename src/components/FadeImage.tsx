import { useState, useRef, useEffect } from "react";

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  bgColor?: string;
  fill?: boolean;
}

export default function FadeImage({
  src,
  alt,
  className = "",
  bgColor = "#F6F6F6",
  fill = false,
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 如果图片已经从缓存加载完成，直接设为true
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden flex ${className} ${fill ? "absolute inset-0 w-full h-full" : ""
        }`}
      style={{ backgroundColor: bgColor }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full transition-opacity duration-[600ms] ease-in-out ${fill ? "h-full object-cover absolute inset-0" : "h-auto relative"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
