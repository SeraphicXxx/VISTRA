import React from "react";
import { Reveal, fadeUp } from "/@/components/landinganim.jsx";
import { UserLogoClickable } from "/@/components/Button.jsx";

export function GenFooter() {
  return (
    <footer className="relative shrink-0 overflow-hidden bg-surface">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d9488]/15" />

      <div className="relative w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          className="h-7 w-full"
          aria-hidden="true"
        >
          <path
            d="M0 24 H340 L368 24 L384 6 L402 42 L420 24 L448 24 H1200"
            fill="none"
            stroke="#0d9488"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      </div>

      <Reveal variants={fadeUp}>
        <div className="relative mx-auto max-w-6xl px-4 pb-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <UserLogoClickable />
              <p className="mt-1 text-sm leading-relaxed text-textSecondary">
                The campus clinic system for University of Caloocan City — built
                so getting seen never gets in the way of class.
              </p>
            </div>

            <nav className="flex flex-col gap-2 text-sm sm:items-end">
              <a
                href="/terms"
                className="text-xs text-primary transition-colors hover:text-primaryDark"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="/privacy"
                className="text-xs text-primary transition-colors hover:text-primaryDark"
              >
                Privacy Policy
              </a>
              <a
                href="/Appoinment"
                className="text-xs text-primary transition-colors hover:text-primaryDark"
              >
                Book an Appointment
              </a>
            </nav>
          </div>

          <div className="mt-3 flex flex-col gap-1 border-t border-border/60 pt-3 text-xs text-textMuted sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Vistra. All rights reserved.</p>
            <p>Covered Court, UCC Campus</p>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}