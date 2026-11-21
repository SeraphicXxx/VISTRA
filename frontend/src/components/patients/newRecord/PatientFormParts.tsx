import type {ReactNode} from "react";
import {Check} from "lucide-react";
import {CLASSIFICATION_OPTIONS, type Classification} from "./newPatientConstants";

export function PatientTypeToggle({value, onChange}: {
    value: Classification;
    onChange: (value: Classification) => void;
}) {
    return (
        <div role="radiogroup" aria-label="Patient type" className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-background p-1">
            {CLASSIFICATION_OPTIONS.map((option) => {
                const selected = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(option.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            selected
                                ? "bg-primary text-white shadow-sm"
                                : "text-textSecondary hover:bg-surface hover:text-textPrimary"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

type StepperProps = {
    steps: {title: string; description: string}[];
    current: number;
    onStepClick: (index: number) => void;
};

export function Stepper({steps, current, onStepClick}: StepperProps) {
    return (
        <nav aria-label="Form progress" className="mb-12">
            <ol className="flex items-start">
                {steps.map((step, index) => {
                    const done = index < current;
                    const active = index === current;
                    const isLast = index === steps.length - 1;

                    return (
                        <li key={step.title} className={`flex items-start ${isLast ? "" : "flex-1"}`}>
                            <button
                                type="button"
                                onClick={() => onStepClick(index)}
                                disabled={!done}
                                aria-current={active ? "step" : undefined}
                                className="group flex flex-col items-center gap-2 text-center disabled:cursor-default"
                            >
                                <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                                        done
                                            ? "border-primary bg-primary text-white group-hover:bg-primaryDark"
                                            : active
                                                ? "border-primary bg-white text-primary ring-4 ring-primary/15"
                                                : "border-border bg-white text-textMuted"
                                    }`}
                                >
                                    {done ? <Check className="h-4 w-4" strokeWidth={2.5}/> : index + 1}
                                </span>
                                <span
                                    className={`hidden whitespace-nowrap text-xs font-medium transition-colors duration-200 md:block ${
                                        active
                                            ? "text-textPrimary"
                                            : done
                                                ? "text-textSecondary"
                                                : "text-textMuted"
                                    }`}
                                >
                                    {step.title}
                                </span>
                            </button>

                            {!isLast && (
                                <span
                                    className={`mx-3 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                                        done ? "bg-primary" : "bg-border"
                                    }`}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            <p className="mt-5 text-center text-xs font-medium text-textMuted md:hidden">
                Step {current + 1} of {steps.length}: {steps[current].title}
            </p>
        </nav>
    );
}

export function StepHeading({title, description}: {title: string; description: string}) {
    return (
        <div>
            <h3 className="font-heading text-lg font-semibold text-textPrimary">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-textMuted">{description}</p>
        </div>
    );
}

export function FieldGroup({title, children}: {title: string; children: ReactNode}) {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <h4 className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary">
                    {title}
                </h4>
                <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                {children}
            </div>
        </section>
    );
}