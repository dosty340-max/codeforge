"use client";

import { useEffect, useRef } from "react";

const GLYPHS = ["0", "1", "/", "+"];
const CELL_X = 14;
const CELL_Y = 18;
const FRAME_MS = 66;

export function BinaryField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    let visible = true;

    function draw(seconds: number) {
      const { clientWidth: width, clientHeight: height } = canvas!;
      context!.clearRect(0, 0, width, height);
      context!.font = "11px ui-monospace, monospace";
      for (let row = 0; row * CELL_Y < height; row++) {
        const bend = Math.sin(row * 0.16 + seconds * 0.35) * 8;
        for (let col = 0; col * CELL_X < width; col++) {
          const wave = Math.sin(col * 0.11 + row * 0.2 + seconds * 0.55) + Math.sin(col * 0.05 - row * 0.09 - seconds * 0.3);
          const strength = (wave + 2) / 4;
          context!.globalAlpha = 0.03 + strength * strength * 0.3;
          context!.fillStyle = strength > 0.85 ? "#c8ff00" : "#ffffff";
          const glyph = GLYPHS[(col * 7 + row * 13 + Math.floor(strength * 6)) % GLYPHS.length];
          context!.fillText(glyph, col * CELL_X + bend, row * CELL_Y + 12);
        }
      }
    }

    function resize() {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = canvas!.clientWidth * scale;
      canvas!.height = canvas!.clientHeight * scale;
      context!.setTransform(scale, 0, 0, scale, 0, 0);
      draw(last / 1000);
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < FRAME_MS) return;
      last = now;
      draw(now / 1000);
    }

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewObserver.observe(canvas);
    if (!still) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
