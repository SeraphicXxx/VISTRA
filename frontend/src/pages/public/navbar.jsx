import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { LogoClickable } from "/@/components/Button.jsx";

const NAV_LINKS = [
  { href: "#app", label: "Mobile App" },
  { href: "#services", label: "Services" },
  { href: "#visit", label: "How It Works" },
];

function LiveDot({ className = "bg-primary" }) {
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setBeat((b) => !b), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${className} transition-transform duration-500`}
        style={{
          transform: beat ? "scale(2.4)" : "scale(1)",
          opacity: beat ? 0 : 0.45,
        }}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${className}`} />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const sectionsRef = useRef([]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    sectionsRef.current = NAV_LINKS.map(({ href }) => document.querySelector(href)).filter(Boolean);
    if (sectionsRef.current.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(`#${visible[0].target.id}`);
          setHasInteracted(true);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sectionsRef.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleLinkClick(href) {
    setActiveSection(href);
    setHasInteracted(true);
    setMobileOpen(false);
  }

  const highlighted = hovered ?? (hasInteracted ? activeSection : null);

  return (
    <header className="sticky top-0 z-30 px-0">
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled
            ? "mt-3 max-w-3xl rounded-2xl border border-border/60 bg-surface/85 px-4 py-2.5 shadow-lg shadow-black/[0.06] backdrop-blur-xl sm:mx-6 lg:mx-auto"
            : "mt-0 max-w-6xl rounded-none border border-transparent bg-transparent px-6 py-5 shadow-none backdrop-blur-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <LogoClickable />
        </div>

        <nav
          onMouseLeave={() => setHovered(null)}
          className="hidden items-center gap-7 text-sm text-textSecondary md:flex"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = highlighted === href;
            return (
              <a
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                onClick={() => handleLinkClick(href)}
                className={`relative py-1 transition-colors ${
                  isActive ? "text-textPrimary" : "hover:text-textPrimary"
                }`}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-px rounded-full bg-textPrimary"
                    transition={
                      reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 460, damping: 34 }
                    }
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden sm:flex">
          <motion.a
            href="#app"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`inline-flex items-center gap-2 rounded-full bg-primary/10 font-semibold text-primaryDark transition-all duration-500 hover:bg-primary/15 ${
              scrolled ? "px-3.5 py-1.5 text-[11px]" : "px-4 py-2 text-xs"
            }`}
          >
            <LiveDot />
            Book an Appointment
          </motion.a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-textPrimary md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`mx-auto overflow-hidden border border-border/60 bg-surface/95 backdrop-blur-xl md:hidden ${
              scrolled ? "mt-2 max-w-3xl rounded-2xl shadow-lg sm:mx-6 lg:mx-auto" : "mt-0 max-w-6xl rounded-b-2xl border-t-0"
            }`}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => handleLinkClick(href)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    hasInteracted && activeSection === href
                      ? "font-medium text-textPrimary"
                      : "text-textSecondary hover:text-textPrimary"
                  }`}
                >
                  {label}
                </a>
              ))}
              <a
                href="#app"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primaryDark"
              >
                <LiveDot />
                Book an Appointment
              </a>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-textPrimary"
              >
                Report a Symptom
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}