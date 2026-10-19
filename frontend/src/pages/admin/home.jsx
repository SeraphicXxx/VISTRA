import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Lock, Heart, Droplets } from "lucide-react";
import {
  LiveDot,
  CountUp,
  HeartbeatLine,
  AdminAnimStyles,
  Reveal,
  usePrefersReducedMotion,
} from "/@/components/adminanim";
import campusImage from "/@/assets/images/campus-background.jpg";

const capabilityChips = ["Appointments", "Medical records", "Reporting"];

const queueSamples = [
  {
    name: "Maria Santos",
    note: "Fever, 38.1°C",
    status: "Waiting",
    tone: "bg-temperature/10 text-temperature",
  },
  {
    name: "Jose Dela Cruz",
    note: "Sprained ankle",
    status: "In triage",
    tone: "bg-primary/10 text-primary",
  },
  {
    name: "Ana Villanueva",
    note: "Headache, 2 days",
    status: "Waiting",
    tone: "bg-temperature/10 text-temperature",
  },
  {
    name: "Paolo Ramos",
    note: "Follow-up check",
    status: "With nurse",
    tone: "bg-success/10 text-success",
  },
];

const statTiles = [
  { n: 18, label: "Visits today", delay: 500 },
  { n: 3, label: "In queue", delay: 650 },
  { n: 7, label: "Appointments", delay: 800 },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdminLandingPage() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % queueSamples.length),
      4500,
    );
    return () => clearInterval(id);
  }, [reduced]);

  const patient = queueSamples[idx];

  return (
    <div className="page-in flex min-h-screen w-full flex-col bg-background font-sans text-textPrimary selection:bg-primary/20 md:h-screen md:overflow-hidden">
      <AdminAnimStyles />

      <header className="slide-down relative z-10 shrink-0 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5 md:px-10">
          <a href="/landingpage" className={`rounded-md ${focusRing}`}>
            <img
              src="/Vistralogo.png"
              alt="Vistra"
              className="h-10 w-auto object-contain"
            />
          </a>

          <a
            href="/login"
            className={`btn-shine inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-200 hover:bg-primaryDark ${focusRing}`}
          >
            Log in
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="relative flex flex-1 items-center overflow-hidden py-12 md:min-h-0 md:py-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-[position:20%_center] opacity-[0.3]"
          style={{ backgroundImage: `url(${campusImage})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/85" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,black,transparent)]" />
        <div className="glow-pulse pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div>
            <Reveal delay={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-textSecondary shadow-card">
                <LiveDot />
                 Cross-Platform Healthcare
              </span>
            </Reveal>

            <Reveal delay={0.1} className="mt-6">
              <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-textPrimary sm:text-5xl lg:text-6xl">
                University of Caloocan City
                <br />
                Clinic Services
              </h1>
            </Reveal>

            <Reveal delay={0.2} className="mt-5">
              <p className="max-w-lg text-lg leading-relaxed text-textSecondary">
                Queue, appointments, and student medical records in <br />
                one console for nurses and staff, updated in real time.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-9">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href="/login"
                  className={`btn-shine group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-primaryDark hover:shadow-lg active:translate-y-px ${focusRing}`}
                >
                  Log in to staff portal
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
                <span className="flex items-center gap-1.5 text-sm text-textSecondary">
                  <Lock className="h-4 w-4" strokeWidth={2} />
                  Staff access only
                </span>
              </div>
            </Reveal>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {capabilityChips.map((label, i) => (
                <Reveal key={label} delay={0.4 + i * 0.1}>
                  <span className="hover-lift inline-flex cursor-default items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-textSecondary">
                    {label}
                  </span>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.8} className="mt-7">
              <p className="flex items-center gap-2 text-sm text-textSecondary">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2} />
                Records are encrypted and scoped to your role.
              </p>
            </Reveal>
          </div>

          <Reveal distance={32} delay={0.2} className="relative mx-auto w-full max-w-xl">
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-primary/10 blur-[80px]" />

            <div className="tilt-card relative overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-card backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-border bg-background px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-temperature/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 flex-1 truncate rounded-md bg-surface px-3 py-1 font-mono text-xs text-textMuted">
                  clinic.ucc.edu.ph/dashboard
                </span>
              </div>

              <div className="p-6 sm:p-7">
                <Reveal delay={0.3}>
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-base font-semibold text-textPrimary">
                      {greeting()}, Nurse Reyes
                    </p>
                    <span className="flex items-center gap-2 text-xs font-medium text-success">
                      <LiveDot className="bg-success" />
                      Live
                    </span>
                  </div>
                </Reveal>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {statTiles.map(({ n, label, delay }, i) => (
                    <Reveal key={label} delay={0.4 + i * 0.1}>
                      <div className="hover-lift h-full rounded-xl border border-border bg-background p-4">
                        <p className="font-mono text-2xl font-semibold tabular-nums text-textPrimary">
                          <CountUp to={n} delay={delay} />
                        </p>
                        <p className="mt-0.5 text-xs text-textMuted">{label}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={0.7} className="mt-3">
                  <div className="min-h-[74px] hover-lift rounded-xl border border-border bg-background p-4">
                    <div
                      key={idx}
                      className="row-in flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-textPrimary">
                          {patient.name}
                        </p>
                        <p className="truncate text-xs text-textSecondary">
                          {patient.note}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${patient.tone}`}
                      >
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </Reveal>

                <div className="mt-3 grid grid-cols-5 gap-3">
                  <Reveal delay={0.8} className="col-span-3">
                    <div className="h-full hover-lift rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between">
                        <Heart
                          className="h-4 w-4 text-heartRate"
                          strokeWidth={2}
                        />
                        <p className="text-xs text-textMuted">Avg heart rate</p>
                      </div>
                      <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums text-textPrimary">
                        <CountUp to={72} delay={900} />
                        <span className="ml-1 text-xs font-normal text-textMuted">
                          bpm
                        </span>
                      </p>
                      <div className="mt-1">
                        <HeartbeatLine />
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.9} className="col-span-2">
                    <div className="h-full hover-lift rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between">
                        <Droplets className="h-4 w-4 text-spo2" strokeWidth={2} />
                        <p className="text-xs text-textMuted">Avg oxygen</p>
                      </div>
                      <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums text-textPrimary">
                        <CountUp to={98} delay={1050} suffix="%" />
                      </p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-spo2/15">
                        <div className="h-full w-[98%] rounded-full bg-spo2" />
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-textSecondary sm:flex-row md:px-10">
          <p>© 2026 University of Caloocan City · Clinic Services</p>
          <p>Privacy · Support</p>
        </div>
      </footer>
    </div>
  );
}