import React, { useEffect, useRef, useState } from "react";
import { HeartPulse, Wind, Thermometer, Scale } from "lucide-react";
import {
  ScrollReveal,
  fadeLeft,
  scrollRise,
  scrollStair,
  demoKeyframes,
} from "../../components/landinganim.jsx";

const STEP_MS = 5000;

// Start the timer once the section is clearly on screen.
const VIEW_OPTIONS = { threshold: 0.3, rootMargin: "0px 0px -80px 0px" };

// Stair geometry (rem). The top step is inset; the bottom step reaches into the featured card.
const STAIR_STEP = 1.25;
const STAIR_OVERLAP = 3.5;

// Tooth icon drawn inline so it works regardless of the installed icon set.
function ToothIcon({ className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M7.5 3C5 3 3.5 5 3.5 7.5c0 2 .6 3.4 1.2 5.2.6 1.8.8 4.3 1.3 6.3.3 1.2 1.2 2 2.2 2 1 0 1.5-1.1 1.9-2.6.4-1.4.8-2.4 1.6-2.4s1.2 1 1.6 2.4c.4 1.5.9 2.6 1.9 2.6 1 0 1.9-.8 2.2-2 .5-2 .7-4.5 1.3-6.3.6-1.8 1.2-3.2 1.2-5.2C20.5 5 19 3 16.5 3c-1.5 0-2.5.7-4.5.7S9 3 7.5 3z" />
    </svg>
  );
}

const FACTS = [
  {
    key: "heart",
    topic: "Heart rate",
    icon: HeartPulse,
    eyebrow: "Vital sign · Pulse",
    big: "60–100",
    unit: "bpm",
    headline: "A typical resting heart rate for adults",
    body: "Most adults fall in this range while at rest. Well-trained athletes often sit lower, sometimes below 60.",
    source: "American Heart Association",
    scale: { min: 40, max: 140, low: 60, high: 100, value: 78, valueLabel: "78 bpm" },
  },
  {
    key: "spo2",
    topic: "Oxygen",
    icon: Wind,
    eyebrow: "Vital sign · SpO₂",
    big: "95–100",
    unit: "%",
    headline: "Healthy blood oxygen saturation",
    body: "Readings that stay consistently below 92% need prompt medical attention.",
    source: "Common clinical reference range",
    scale: { min: 80, max: 100, low: 95, high: 100, value: 98, valueLabel: "98%" },
  },
  {
    key: "temp",
    topic: "Temperature",
    icon: Thermometer,
    eyebrow: "Vital sign · Temperature",
    big: "36.6",
    unit: "°C",
    headline: "Average body temperature is lower than once taught",
    body: "A 2020 eLife study of US health records found the typical adult temperature is about 36.6°C, below the long-cited 37°C.",
    source: "Protsiv et al., eLife, 2020",
    scale: { min: 35, max: 39, low: 36.1, high: 37.2, value: 36.6, valueLabel: "36.6°C" },
  },
  {
    key: "bmi",
    topic: "Body mass index",
    icon: Scale,
    eyebrow: "Body measure · BMI",
    big: "18.5–24.9",
    unit: "kg/m²",
    headline: "BMI compares weight to height",
    body: "WHO adult categories: under 18.5 is underweight, 25 to 29.9 is overweight, and 30 or more is obesity. BMI does not measure body fat directly.",
    source: "World Health Organization",
    scale: { min: 15, max: 35, low: 18.5, high: 24.9, value: 22.4, valueLabel: "22.4" },
  },
  {
    key: "teeth",
    topic: "Teeth",
    icon: ToothIcon,
    eyebrow: "Dental · Permanent teeth",
    big: "32",
    unit: "teeth",
    headline: "Adults have 32 permanent teeth",
    body: "Eight teeth in each of four quadrants, wisdom teeth included. Untreated tooth decay in permanent teeth is among the most common conditions worldwide.",
    source: "World Health Organization oral health fact sheet",
    scale: null,
  },
];

const QUADRANTS = ["Upper right", "Upper left", "Lower left", "Lower right"];

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function AbstractArt() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        fill="none"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem]"
      >
        <g
          style={{
            animation: "spinSlow 60s linear infinite",
            transformBox: "view-box",
            transformOrigin: "200px 200px",
            willChange: "transform",
          }}
        >
          <circle cx="200" cy="200" r="170" stroke="rgba(13,148,136,0.22)" strokeWidth="1.5" strokeDasharray="4 12" />
          <circle cx="200" cy="200" r="125" stroke="rgba(13,148,136,0.16)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="80" stroke="rgba(13,148,136,0.14)" strokeWidth="1.5" strokeDasharray="2 9" />
        </g>
        <path
          d="M200 70 C 290 130, 310 250, 225 320 C 155 375, 85 300, 100 225 C 115 150, 150 95, 200 70Z"
          fill="rgba(13,148,136,0.08)"
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full"
      >
        <path d="M0 80 C 80 20, 160 20, 220 70 S 360 110, 400 40 L400 120 L0 120Z" fill="rgba(13,148,136,0.07)" />
        <path d="M0 100 C 90 60, 170 60, 230 95 S 360 120, 400 80" stroke="rgba(13,148,136,0.28)" strokeWidth="1.5" />
      </svg>
    </>
  );
}

function RangeScale({ scale }) {
  const pct = (v) => ((v - scale.min) / (scale.max - scale.min)) * 100;
  const left = pct(scale.low);
  const width = pct(scale.high) - left;
  const marker = pct(scale.value);

  return (
    <div className="w-full">
      <div className="relative h-3 rounded-full bg-white/25">
        <div
          className="absolute inset-y-0 rounded-full bg-white/65"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        <div
          className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primaryDark bg-white shadow-card"
          style={{ left: `${marker}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[11px] text-white/70">
        <span>{scale.min}</span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-semibold text-white">
          Sample reading · {scale.valueLabel}
        </span>
        <span>{scale.max}</span>
      </div>
    </div>
  );
}

function ToothDots() {
  return (
    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-4">
      {QUADRANTS.map((quadrant, qi) => (
        <div key={quadrant}>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className="h-3 w-3 rounded-full bg-white"
                style={{
                  animation: "factDot 450ms ease-out both",
                  animationDelay: `${(qi * 8 + i) * 60}ms`,
                }}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-white/70">
            {quadrant}
          </p>
        </div>
      ))}
    </div>
  );
}

function FeaturedFact({ fact, step }) {
  return (
    <article
      className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primaryDark via-primary to-primaryDark p-7 text-white shadow-card md:p-8"
      style={{ transform: "translateZ(0)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:16px_16px]"
      />

      {/* Only this content re-mounts per step; the card itself stays put, so nothing flashes. */}
      <div
        key={fact.key}
        className="relative"
        style={{ animation: "factIn 500ms cubic-bezier(0.22,1,0.36,1) both", willChange: "opacity, transform" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-4 select-none font-heading text-[12rem] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.22)]"
        >
          0{step + 1}
        </span>

        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
          {fact.eyebrow}
        </span>

        <p className="mt-5 font-heading text-6xl font-bold tracking-tight md:text-6xl">
          {fact.big}
          <span className="ml-2 font-mono text-base font-normal text-white/75">{fact.unit}</span>
        </p>

        <h4 className="mt-4 font-heading text-xl font-semibold md:text-2xl">{fact.headline}</h4>
        <p className="mt-3 max-w-2xl leading-relaxed text-white/85">{fact.body}</p>

        {/* Fixed minimum height so the card does not resize between steps. */}
        <div className="mt-6 flex min-h-[9rem] items-center rounded-2xl border border-white/20 bg-white/10 p-5 md:p-6">
          {fact.scale ? <RangeScale scale={fact.scale} /> : <ToothDots />}
        </div>

        <p className="mt-5 text-xs text-white/70">Source: {fact.source}</p>
      </div>
    </article>
  );
}

function FactIndex({ step }) {
  const nextFact = FACTS[(step + 1) % FACTS.length];

  return (
    <div>
      <ol className="flex flex-col gap-3">
        {FACTS.map((fact, i) => {
          const isActive = i === step;
          const Icon = fact.icon;
          // Stair: top step is inset; each step below widens, and the bottom step overlaps the featured card.
          const left = (FACTS.length - 1 - i) * STAIR_STEP - STAIR_OVERLAP;

          return (
            <ScrollReveal
              key={fact.key}
              as="li"
              variants={scrollStair}
              custom={i}
              style={{ "--stair": `${left}rem` }}
              className={`relative z-20 flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color,box-shadow] duration-500 ease-out md:ml-[var(--stair)] ${
                isActive
                  ? "border-primary/40 bg-white shadow-card"
                  : "border-border/60 bg-white/90"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                  isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-base font-semibold text-textPrimary">
                    {fact.topic}
                  </span>
                  <span className="font-mono text-xs text-textMuted">0{i + 1}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-textSecondary">{fact.headline}</p>
              </div>

              {isActive && (
                <span
                  key={step}
                  aria-hidden="true"
                  className="absolute bottom-0 left-4 right-4 h-0.5 origin-left bg-primary"
                  style={{
                    animation: `barFill ${STEP_MS}ms linear forwards`,
                    willChange: "transform",
                  }}
                />
              )}
            </ScrollReveal>
          );
        })}
      </ol>

      <ScrollReveal
        variants={scrollRise}
        delay={0.5}
        className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-primary/30 px-4 py-3 text-xs text-textSecondary"
      >
        <span>Up next</span>
        <span className="font-semibold text-primaryDark">{nextFact.topic}</span>
      </ScrollReveal>
    </div>
  );
}

function AssessmentDemo({ active }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), STEP_MS);
    return () => window.clearInterval(id);
  }, [active]);

  const step = tick % FACTS.length;

  return (
    <div>
      <ScrollReveal variants={scrollRise} className="mb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Health facts
          </p>
          <h3 className="mt-2 font-heading text-3xl font-semibold leading-tight text-textPrimary md:text-4xl">
            What the numbers actually mean
          </h3>
        </div>
        <span className="rounded-full border border-border bg-white/70 px-4 py-1.5 font-mono text-sm text-textSecondary">
          {String(step + 1).padStart(2, "0")} / {String(FACTS.length).padStart(2, "0")}
        </span>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
        <ScrollReveal variants={fadeLeft} className="relative z-10 md:col-span-7">
          <FeaturedFact fact={FACTS[step]} step={step} />
        </ScrollReveal>

        <aside className="relative md:col-span-5 md:mt-12">
          <FactIndex step={step} />
        </aside>
      </div>
    </div>
  );
}

export default function AssessmentDemoCard() {
  const [ref, inView] = useInView(VIEW_OPTIONS);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden border-y border-white/70 bg-white/80 px-6 py-10 shadow-card md:px-12 md:py-12"
    >
      <AbstractArt />
      <style>{demoKeyframes}</style>
      <div className="relative mx-auto max-w-[90rem]">
        <AssessmentDemo active={inView} />
      </div>
    </div>
  );
}