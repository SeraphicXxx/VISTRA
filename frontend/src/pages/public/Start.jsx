import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, fadeUp, fadeRight } from "../../components/landinganim.jsx";
import { Reveal as CardReveal } from "/@/components/adminanim";
import { LiveDot } from "./Shared.jsx";
import { vitalStyles } from "./data.jsx";
import { ROUTES } from "/@/config/RoutePaths";
import campusImage from "/@/assets/images/campus-background.jpg";

const medicalFacts = [
  {
    key: "heartRate",
    label: "Heart rate",
    range: "60–100",
    unit: "bpm",
    fact: "Normal resting rate for adults. Trained athletes often sit lower.",
  },
  {
    key: "spo2",
    label: "Oxygen saturation",
    range: "95–100",
    unit: "%",
    fact: "Readings below 90% usually need prompt medical attention.",
  },
  {
    key: "temperature",
    label: "Body temperature",
    range: "36.1–37.2",
    unit: "°C",
    fact: "A fever is generally defined as 38 °C or higher.",
  },
  {
    key: "bmi",
    label: "Body mass index",
    range: "18.5–24.9",
    unit: "kg/m²",
    fact: "A screening measure of weight for height, not a diagnosis.",
  },
];

export default function Start() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-[position:center] opacity-[0.3]"
        style={{ backgroundImage: `url(${campusImage})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/85" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />

      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <Reveal variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] tracking-wide text-textSecondary shadow-card">
              <LiveDot />
              UCC CLINIC &middot; WALK-INS ARE WELCOME
            </span>
          </Reveal>

          <Reveal variants={fadeUp} delay={0.1}>
            <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-textPrimary md:text-5xl">
              Clinic Services Across <br/> Every Platform.
            </h1>
          </Reveal>

          <Reveal variants={fadeUp} delay={0.2}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-textSecondary">
              Provide students and healthcare professionals with a secure,
              centralized platform for managing medical records, dental records,
              appointments, and vital signs—enhancing efficiency, improving accessibility,
              and supporting high-quality healthcare services across all campus.
            </p>
          </Reveal>

          <Reveal variants={fadeUp} delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#app"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02] hover:bg-primaryDark"
              >
                Download the App
              </a>
              <Link
                to={ROUTES.patient.login}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-textPrimary transition-colors hover:border-primary/40"
              >
                Proceed to Check-In
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal variants={fadeRight} delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/90 p-6 shadow-card backdrop-blur">
            <div
              className="scan-line pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
              aria-hidden="true"
            />

            <div className="mb-5">
              <p className="font-mono text-[11px] uppercase tracking-wide text-textMuted">Reference</p>
              <h3 className="mt-1 font-heading text-lg font-semibold text-textPrimary">
                Normal ranges for adults
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {medicalFacts.map(({ key, label, range, unit, fact }, index) => (
                <CardReveal
                  key={key}
                  as="div"
                  delay={index * 0.12}
                  distance={18}
                  className="h-full"
                >
                  <div
                    className={`group h-full cursor-default rounded-2xl border border-border bg-background p-4 ring-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-card ${vitalStyles[key].ring}`}
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold transition-transform duration-300 group-hover:scale-105 ${vitalStyles[key].chip}`}
                    >
                      {label}
                    </span>
                    <p className="mt-3 font-mono text-2xl font-semibold text-textPrimary transition-colors duration-300 group-hover:text-primaryDark">
                      {range}
                      <span className="ml-1 text-xs font-normal text-textMuted">{unit}</span>
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-textMuted">{fact}</p>
                  </div>
                </CardReveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}