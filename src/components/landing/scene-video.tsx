"use client";

import { useEffect, useRef } from "react";

export function SceneVideo({
  name,
  label,
  className,
  startAt,
}: {
  name: "network" | "ambient" | "plan" | "build" | "verify" | `creator-${string}`;
  label?: string;
  className?: string;
  startAt?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster={`/video/${name}.jpg`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <source src={`/video/${name}.mp4${startAt ? `#t=${startAt}` : ""}`} type="video/mp4" />
    </video>
  );
}
