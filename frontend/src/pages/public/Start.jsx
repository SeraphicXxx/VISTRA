import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, fadeUp } from "../../components/landinganim.jsx";
import { LiveDot } from "./Shared.jsx";
import { ROUTES } from "/@/config/RoutePaths";
import campusImage from "/@/assets/images/campus-background.jpg";

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

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex min-h-[calc(100svh-7rem)] items-center justify-center py-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Reveal variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs tracking-wide text-textSecondary shadow-card">
                <LiveDot />
                UCC CLINIC &middot; WALK-INS ARE WELCOME
              </span>
            </Reveal>

            <Reveal variants={fadeUp} delay={0.1}>
              <h1 className="mt-6 font-heading text-5xl font-bold leading-[1.05] tracking-tight text-textPrimary md:text-6xl lg:text-7xl">
                Clinic Services Across <br />
                <span className="bg-gradient-to-r from-primary to-primaryDark bg-clip-text text-transparent">
                  Every Platform.
                </span>
              </h1>
            </Reveal>

            <Reveal variants={fadeUp} delay={0.2}>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-textSecondary md:text-xl">
                Provide students and healthcare professionals with a secure,
                centralized platform for managing medical records, dental records,
                appointments, and vital signs—enhancing efficiency, improving accessibility,
                and supporting high-quality healthcare services across all campus.
              </p>
            </Reveal>

            <Reveal variants={fadeUp} delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#app"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-semibold text-white shadow-card transition-transform hover:scale-[1.02] hover:bg-primaryDark"
                >
                  Download the App
                </a>
                <Link
                  to={ROUTES.patient.login}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-7 py-4 text-base font-medium text-textPrimary transition-colors hover:border-primary/40"
                >
                  Proceed to Check-In
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}