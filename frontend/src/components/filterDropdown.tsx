import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-textSecondary transition-colors duration-150 ${
          value
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-border bg-surface hover:border-primary/30 hover:text-textPrimary"
        }`}
      >
        <span>{label}</span>
        {value && (
          <span className="max-w-[110px] truncate rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
            {value}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={`block w-full px-3 py-1.5 text-left text-xs transition-colors duration-150 ${
              !value ? "font-semibold text-primary" : "text-textSecondary"
            } hover:bg-primary/5`}
          >
            All {label}
          </button>

          <div className="my-1 h-px bg-border" />

          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full truncate px-3 py-1.5 text-left text-xs transition-colors duration-150 ${
                value === opt ? "font-semibold text-primary" : "text-textSecondary"
              } hover:bg-primary/5`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}