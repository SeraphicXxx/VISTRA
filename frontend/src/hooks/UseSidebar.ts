import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useSidebar(firstLinkRef: React.RefObject<HTMLElement | null>) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    close();
  }, [location.pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        close();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, firstLinkRef]);

  return {
    isOpen,
    open,
    close,
  };
}