"use client";

/**
 * ScrollReveal — lightweight entrance-animation wrapper.
 *
 * On mount it checks `prefers-reduced-motion`. If the user prefers reduced
 * motion the component renders children immediately with no animation at all.
 *
 * Otherwise an IntersectionObserver watches the wrapper element. When it
 * enters the viewport the element transitions from:
 *   opacity 0  →  1
 *   translateY 12px  →  0
 * over 300 ms (ease-out). Intersection threshold is 10% so the animation
 * fires before the element is fully visible — feels snappy, not delayed.
 *
 * Usage:
 *   <ScrollReveal>
 *     <section>...</section>
 *   </ScrollReveal>
 *
 *   <ScrollReveal delay={100}>  ← optional stagger in ms
 *     <div>...</div>
 *   </ScrollReveal>
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps {
  children: React.ReactNode;
  /** Additional delay before the transition starts, in ms. Default: 0. */
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const prefersReduced = React.useRef(false);

  React.useEffect(() => {
    // Read preference once on client
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced.current) {
      // Skip animation — show immediately
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // When prefers-reduced-motion — render with no animation wrapper overhead
  if (prefersReduced.current) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "300ms",
        transitionTimingFunction: "ease-out",
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
