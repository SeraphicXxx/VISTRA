import {useEffect, useRef, useState, type KeyboardEvent} from "react";

export function CourseSelect({
    id,
    label,
    options,
    error,
}: {
    id: string;
    label: string;
    options: { code: string; label: string }[];
    error?: string;
}) {
    const [query, setQuery] = useState<string>("");
    const [selectedCode, setSelectedCode] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [active, setActive] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const q = query.trim().toLowerCase();
    const matches = q
        ? options.filter(
            (o) => o.label.toLowerCase().includes(q) || o.code.toLowerCase().includes(q),
        )
        : options;

    // Blocks Continue/Save until a course is picked from the list, not just typed.
    useEffect(() => {
        inputRef.current?.setCustomValidity(selectedCode ? "" : "Select a course from the list.");
    }, [selectedCode]);

    const choose = (option: { code: string; label: string }): void => {
        setSelectedCode(option.code);
        setQuery(option.label);
        setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, Math.max(matches.length - 1, 0)));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && open && matches[active]) {
            e.preventDefault();
            choose(matches[active]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <div className="relative">
            <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-textSecondary">
                {label} <span className="text-red-500">*</span>
            </label>

            <input
                ref={inputRef}
                id={id}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-autocomplete="list"
                autoComplete="off"
                placeholder="Search course..."
                required
                value={query}
                onFocus={(e) => {
                    setOpen(true);
                    e.target.select();
                }}
                onBlur={() => setOpen(false)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedCode("");
                    setOpen(true);
                    setActive(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

            {/* The saved value. Its name is "course", so FormData includes it. */}
            <input type="hidden" name="course" value={selectedCode} />

            {open && (
                <ul
                    id={`${id}-list`}
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-white py-1 shadow-lg"
                >
                    {matches.length === 0 ? (
                        <li className="px-3.5 py-2.5 text-sm text-textMuted">No course found</li>
                    ) : (
                        matches.map((option, index) => {
                            const isSelected = option.code === selectedCode;
                            const isActive = index === active;

                            return (
                                <li
                                    key={option.code}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(e) => {
                                        // Keeps focus in the input so onBlur does not close the list first.
                                        e.preventDefault();
                                        choose(option);
                                    }}
                                    onMouseEnter={() => setActive(index)}
                                    className={`cursor-pointer px-3.5 py-2 text-sm transition-colors ${
                                        isActive ? "bg-primary/10 text-primary" : "text-textPrimary"
                                    } ${isSelected ? "font-semibold" : ""}`}
                                >
                                    {option.label}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}

            {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
        </div>
    );
}