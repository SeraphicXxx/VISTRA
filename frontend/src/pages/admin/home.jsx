import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { LiveDot, AdminAnimStyles, Reveal } from "/@/components/adminanim";
import campusImage from "/@/assets/images/campus-background.jpg";

const capabilityChips = ["Appointments", "Medical records", "Reporting"];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function AdminLandingPage() {
  return (
    <div className="page-in relative flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-textPrimary selection:bg-primary/20">
      <AdminAnimStyles />

      {/* Campus photo, faint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${campusImage})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/45 to-background/85" />

      {/* Soft abstract accent behind the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
        <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/25" />
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-border/60 bg-transparent backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <a href="/landingpage" className={`rounded-md ${focusRing}`}>
            <img src="/Vistralogo.png" alt="Vistra" className="h-9 w-auto object-contain" />
          </a>

          <a
            href="/login"
            className={`inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-200 hover:bg-primaryDark ${focusRing}`}
          >
            Log in
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero, centered on screen */}
      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-6">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <Reveal delay={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-textSecondary">
              <LiveDot />
              Cross-Platform Healthcare
            </span>
          </Reveal>

          <Reveal delay={0.1} className="mt-6">
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-textPrimary sm:text-5xl lg:text-6xl">
              University of Caloocan City
              <br />
              <span className="text-primary">Clinic Services</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2} className="mt-5">
            <p className="mx-auto max-w-xl text-base leading-relaxed text-textSecondary md:text-lg">
              Queue, appointments, and student medical records in one console for nurses and
              staff, updated in real time.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
              <a
                href="/login"
                className={`group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-card transition-colors duration-200 hover:bg-primaryDark ${focusRing}`}
              >
                Medical Personnel Portal
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <span className="flex items-center gap-1.5 text-sm text-textSecondary">
                <Lock className="h-4 w-4" strokeWidth={2} />
                Staff access only
              </span>
            </div>
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {capabilityChips.map((label, i) => (
              <Reveal key={label} delay={0.4 + i * 0.1}>
                <span className="inline-flex cursor-default items-center rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-textSecondary">
                  {label}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.7} className="mt-7">
            <p className="flex items-center gap-2 text-sm text-textSecondary">
              <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2} />
              Records are encrypted and scoped to your role.
            </p>
          </Reveal>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 border-t border-border/60 bg-surface/70 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1 px-6 py-3 text-xs text-textSecondary sm:flex-row md:px-10">
          <p>© 2026 University of Caloocan City · Clinic Services</p>
          <p>Privacy · Support</p>
        </div>
      </footer>
    </div>
  );
}