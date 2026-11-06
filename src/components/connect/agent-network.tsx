"use client";

import { useEffect, useRef } from "react";

const NODE_AREA = 16000;
const LINK_DISTANCE = 150;
const FRAME_MS = 33;

type Node = { x: number; y: number; vx: number; vy: number; hub: boolean };

export function AgentNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let nodes: Node[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;

    function draw() {
      const { clientWidth: width, clientHeight: height } = canvas!;
      context!.clearRect(0, 0, width, height);

      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const distance = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
          if (distance > LINK_DISTANCE) continue;
          context!.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.35;
          context!.strokeStyle = nodes[a].hub || nodes[b].hub ? "#c8ff00" : "#ffffff";
          context!.beginPath();
          context!.moveTo(nodes[a].x, nodes[a].y);
          context!.lineTo(nodes[b].x, nodes[b].y);
          context!.stroke();
        }
      }

      for (const node of nodes) {
        context!.globalAlpha = node.hub ? 0.9 : 0.5;
        context!.fillStyle = node.hub ? "#c8ff00" : "#ffffff";
        context!.beginPath();
        context!.arc(node.x, node.y, node.hub ? 3.5 : 1.75, 0, Math.PI * 2);
        context!.fill();
      }
    }

    function resize() {
      const { clientWidth: width, clientHeight: height } = canvas!;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * scale;
      canvas!.height = height * scale;
      context!.setTransform(scale, 0, 0, scale, 0, 0);
      const count = Math.round((width * height) / NODE_AREA);
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        hub: index % 9 === 0,
      }));
      draw();
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < FRAME_MS) return;
      last = now;
      const { clientWidth: width, clientHeight: height } = canvas!;
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }
      draw();
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
