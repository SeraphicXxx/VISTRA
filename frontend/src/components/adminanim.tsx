import React, { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);

    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

export function LiveDot({ className = "bg-primary" }: { className?: string }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5" aria-hidden="true">
      <span
        className={`live-ping absolute inline-flex h-full w-full rounded-full ${className}`}
      />
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${className}`}
      />
    </span>
  );
}

export function CountUp({
  to,
  duration = 900,
  delay = 0,
  suffix = "",
}: {
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const fromRef = useRef<number>(0);
  const [val, setVal] = useState<number>(reduced ? to : 0);

  useEffect(() => {
    if (reduced) {
      fromRef.current = to;
      setVal(to);
      return;
    }

    let raf = 0;
    let start: number | undefined;
    const startVal = fromRef.current;

    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        start ??= now;
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const next = Math.round(startVal + (to - startVal) * eased);
        fromRef.current = next;
        setVal(next);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, duration, delay, reduced]);

  return (
    <>
      {val}
      {suffix}
    </>
  );
}

export function AnimatedBar({
  value,
  max,
  className = "bg-primary",
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-border/60"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${className}`}
        style={{
          width: `${width}%`,
          transition: reduced
            ? "none"
            : "width 0.9s cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      />
    </div>
  );
}

export function RevealItem({
  index = 0,
  step = 70,
  children,
  className = "",
}: {
  index?: number;
  step?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`row-in ${className}`}
      style={{ animationDelay: `${0.15 + (index * step) / 1000}s` }}
    >
      {children}
    </div>
  );
}

const ecgBeat = (o: number): string =>
  `H${o + 55} L${o + 68} 30 L${o + 74} 25 L${o + 80} 30 L${o + 90} 30 L${o + 98} 36 L${o + 108} 8 L${o + 118} 50 L${o + 128} 30 L${o + 145} 30 L${o + 154} 22 L${o + 164} 30 H${o + 200}`;

const ecgPath = `M0 30 ${[0, 200, 400, 600].map(ecgBeat).join(" ")}`;

export function HeartbeatLine({
  className = "text-heartRate",
  heightClass = "h-8",
  delay = 0,
  duration = 7,
}: {
  className?: string;
  heightClass?: string;
  delay?: number;
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className={`${heightClass} w-full overflow-hidden ${className} [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 60"
        preserveAspectRatio="none"
        className="ecg-scroll h-full"
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationPlayState: reduced ? "paused" : "running",
        }}
      >
        <path
          d={ecgPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const staggerRules = Array.from({ length: 12 }, (_, i) => {
  return `.stagger-group > *:nth-child(${i + 1}) { animation-delay: ${0.75 + i * 0.09}s; }`;
}).join("\n");

const formStaggerRules = Array.from({ length: 8 }, (_, i) => {
  return `.form-stagger > *:nth-child(${i + 1}) { animation-delay: ${0.5 + i * 0.08}s; }`;
}).join("\n");

export function AdminAnimStyles() {
  return (
    <style>{`
      .bg-grid {
        background-image:
          linear-gradient(rgb(var(--grid-rgb, 20 184 166) / 0.09) 1px, transparent 1px),
          linear-gradient(90deg, rgb(var(--grid-rgb, 20 184 166) / 0.09) 1px, transparent 1px);
        background-size: 44px 44px;
      }

      @keyframes livePing {
        0%   { transform: scale(1);   opacity: 0.5; }
        80%, 100% { transform: scale(2.6); opacity: 0; }
      }
      .live-ping { animation: livePing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }

      @keyframes fadeInUp {
        0%   { opacity: 0; transform: translateY(18px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }

      @keyframes fadeInRight {
        0%   { opacity: 0; transform: translateX(28px) scale(0.985); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
      }
      .fade-in-right {
        animation: fadeInRight 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s both;
      }

      .stagger-group > * {
        animation: fadeInUp 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
      }
      ${staggerRules}

      @keyframes rowIn {
        0%   { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .row-in { animation: rowIn 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both; }

      @keyframes ecgScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .ecg-scroll {
        display: block;
        width: 200%;
        max-width: none;
        animation: ecgScroll 10s linear infinite;
        will-change: transform;
      }

      @keyframes pageIn { from { opacity: 0; } to { opacity: 1; } }
      .page-in { animation: pageIn 0.5s ease-out both; }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-100%); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .slide-down { animation: slideDown 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }

      .reveal-group > * { animation: fadeInUp 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
      .reveal-group > *:nth-child(1) { animation-delay: 0.15s; }
      .reveal-group > *:nth-child(2) { animation-delay: 0.25s; }
      .reveal-group > *:nth-child(3) { animation-delay: 0.35s; }
      .reveal-group > *:nth-child(4) { animation-delay: 0.45s; }
      .reveal-group > *:nth-child(5) { animation-delay: 0.55s; }
      .reveal-group > *:nth-child(6) { animation-delay: 0.65s; }

      .hover-lift {
        transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1),
                    box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .hover-lift:hover {
        transform: translateY(-3px);
        border-color: rgb(var(--grid-rgb, 20 184 166) / 0.55);
        box-shadow: 0 12px 24px -14px rgb(var(--grid-rgb, 20 184 166) / 0.45);
      }

      .shimmer { position: relative; overflow: hidden; }
      .shimmer::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
        transform: translateX(-100%);
        animation: shimmerSweep 1.6s ease-in-out infinite;
      }
      @keyframes shimmerSweep { to { transform: translateX(100%); } }

      .btn-shine { position: relative; overflow: hidden; }
      .btn-shine::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
        transform: translateX(-120%);
        transition: transform 0.7s ease;
        pointer-events: none;
      }
      .btn-shine:hover::after { transform: translateX(120%); }

      .tilt-card {
        transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.6s ease;
      }
      .tilt-card:hover {
        will-change: transform;
        transform: perspective(1200px) rotateY(-3deg) rotateX(2deg) translateY(-4px);
        box-shadow: 0 30px 60px -30px rgb(var(--grid-rgb, 20 184 166) / 0.45);
      }

      @keyframes cardIn {
        from { opacity: 0; transform: translateY(24px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      .card-in { animation: cardIn 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s backwards; }

      @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .bar-grow {
        transform-origin: left;
        animation: barGrow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.45s backwards;
      }

      .form-stagger > * { animation: fadeInUp 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
      ${formStaggerRules}

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(2px); }
      }
      .shake { animation: shake 0.45s ease-in-out, rowIn 0.3s ease-out; }

      .link-underline {
        background: linear-gradient(currentColor, currentColor) left bottom / 0 1px no-repeat;
        transition: background-size 0.3s ease, color 0.2s ease;
      }
      .link-underline:hover, .link-underline:focus-visible { background-size: 100% 1px; }

      .hover-pop { display: inline-block; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      .hover-pop:hover { transform: scale(1.06); }

      @keyframes panelIn {
        from { clip-path: inset(0 100% 0 0); opacity: 0.6; }
        to   { clip-path: inset(0 0 0 0); opacity: 1; }
      }
      .panel-in { animation: panelIn 1s cubic-bezier(0.7, 0, 0.2, 1) 0.2s backwards; }

      @keyframes gridDrift {
        from { background-position: 0 0; }
        to   { background-position: 44px 44px; }
      }
      .grid-drift { animation: gridDrift 6s linear infinite; }

      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-28px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .layout-in > :first-child {
        animation: slideInLeft 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
      }

      @keyframes routeIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .route-in { animation: routeIn 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }

      @keyframes scanline {
        0%   { transform: translateY(-8%); opacity: 0; }
        12%  { opacity: 1; }
        88%  { opacity: 1; }
        100% { transform: translateY(108%); opacity: 0; }
      }
      .scan-line { animation: scanline 3.6s linear infinite; }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-6px); }
      }
      .float-slow { animation: float 7s ease-in-out infinite; }

      @keyframes glowPulse {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 0.9;  transform: scale(1.06); }
      }
      .glow-pulse { animation: glowPulse 7s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .live-ping, .fade-in-up, .fade-in-right, .row-in, .ecg-scroll,
        .scan-line, .float-slow, .glow-pulse, .stagger-group > *, .page-in, .slide-down,
        .card-in, .bar-grow, .form-stagger > *, .shake, .panel-in, .grid-drift, .route-in,
        .layout-in > :first-child, .shimmer::after, .reveal-group > * {
          animation: none !important;
        }
        .btn-shine::after { animation: none !important; transition: none !important; }
        .hover-lift:hover, .tilt-card:hover, .hover-pop:hover { transform: none; }
      }
    `}</style>
  );
}

export function useReveal<T extends HTMLElement = HTMLElement>({
  threshold = 0.2,
}: {
  threshold?: number;
} = {}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const visible = reduced || inView;
  const t = (css: string): string => (reduced ? "none" : css);

  return { ref, visible, reduced, t };
}

export function revealStyle(
  visible: boolean,
  reduced: boolean,
  {
    delay = 0,
    distance = 24,
    duration = 0.7,
  }: { delay?: number; distance?: number; duration?: number } = {}
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateY(0) scale(1)"
      : `translateY(${distance}px) scale(0.98)`,
    transition: reduced
      ? "none"
      : `opacity ${duration}s ease ${delay}s,
         transform ${duration}s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}s`,
  };
}

export function Reveal({
  as = "div",
  children,
  delay = 0,
  distance = 24,
  threshold = 0.2,
  className = "",
}: {
  as?: "div" | "section" | "li" | "span";
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  threshold?: number;
  className?: string;
}) {
  const { ref, visible, reduced } = useReveal({ threshold });
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={className}
      style={revealStyle(visible, reduced, { delay, distance })}
    >
      {children}
    </Tag>
  );
}

export function ViewCountUp({
  to,
  visible = true,
  suffix = "",
  ...rest
}: {
  to: number;
  visible?: boolean;
  suffix?: string;
  delay?: number;
  duration?: number;
}) {
  return visible ? (
    <CountUp to={to} suffix={suffix} {...rest} />
  ) : (
    <>
      {0}
      {suffix}
    </>
  );
}