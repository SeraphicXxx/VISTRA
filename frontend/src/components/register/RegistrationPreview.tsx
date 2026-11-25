import {Clock} from "lucide-react";
import {primaryButton, secondaryButton} from "/@/components/button";
import {useState} from "react";

export type SummaryRow = {label: string; value: string};
export type SummarySection = {title: string; rows: SummaryRow[]};

type FieldDef = [key: string, label: string];
type GroupDef = {title: string; fields: FieldDef[]};

const PERSONAL_GROUP: GroupDef = {
    title: "Personal information",
    fields: [
        ["last_name", "Last name"],
        ["first_name", "First name"],
        ["middle_name", "Middle name"],
        ["patient_id", "ID number"],
        ["birthday", "Birthday"],
        ["age", "Age"],
        ["sex", "Sex"],
        ["civil_status", "Civil status"],
        ["mobile_number", "Mobile number"],
        ["email", "Email"],
    ],
};

const ENROLLMENT_GROUP: GroupDef = {
    title: "Enrollment or employment",
    fields: [
        ["course", "Course"],
        ["year", "Year"],
        ["section", "Section"],
        ["department", "Department"],
        ["position", "Position"],
    ],
};

const ADDRESS_GROUP: GroupDef = {
    title: "Address",
    fields: [
        ["address", "Address"],
        ["barangay", "Barangay"],
    ],
};

const EMERGENCY_GROUP: GroupDef = {
    title: "Emergency contact",
    fields: [
        ["emergency_name", "Contact name"],
        ["emergency_relation", "Relationship"],
        ["emergency_phone", "Contact phone"],
    ],
};

const MEDICAL_GROUPS: GroupDef[] = [
    {
        title: "Medical history",
        fields: [
            ["hospitalization_year", "Hospitalization year"],
            ["diagnosis", "Diagnosis"],
            ["allergy_medicine", "Medicine allergy"],
        ],
    },
    {
        title: "Personal history",
        fields: [
            ["smoking", "Smoking"],
            ["vaping", "Vaping"],
            ["alcohol_intake", "Alcohol"],
            ["last_menstrual_period", "Last menstrual period"],
            ["contraceptive_method", "Contraceptive method"],
        ],
    },
    {
        title: "Family history",
        fields: [
            ["family_history", "Conditions"],
            ["family_history_others", "Others"],
        ],
    },
    {
        title: "Vital signs",
        fields: [
            ["heart_rate", "Heart rate (bpm)"],
            ["temperature", "Temperature (°C)"],
            ["spo2", "SpO₂ (%)"],
            ["weight", "Weight (kg)"],
            ["height", "Height (cm)"],
            ["bmi", "BMI (kg/m²)"],
        ],
    },
    {
        title: "Results",
        fields: [
            ["chest_xray", "Chest X-Ray"],
            ["cbc", "CBC"],
            ["urinalysis", "Urinalysis"],
        ],
    },
    {
        title: "Recommendation",
        fields: [["recommendation", "Examining physician's recommendation"]],
    },
];

// Never shown, even if they appear in the data.
const SENSITIVE_KEYS = new Set<string>(["password", "confirm_password"]);

const toText = (value: unknown): string => {
    if (Array.isArray(value)) return value.map(String).filter(Boolean).join(", ");
    if (value === null || value === undefined) return "";
    return String(value).trim();
};

const humanize = (key: string): string =>
    key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// Puts the known fields in order, then adds any other filled values under a leftover title.
function collect(
    source: Record<string, unknown>,
    groups: GroupDef[],
    leftoverTitle: string,
): SummarySection[] {
    const used = new Set<string>();
    const sections: SummarySection[] = [];

    for (const group of groups) {
        const rows: SummaryRow[] = [];
        for (const [key, label] of group.fields) {
            used.add(key);
            const value = toText(source[key]);
            if (value) rows.push({label, value});
        }
        if (rows.length > 0) sections.push({title: group.title, rows});
    }

    const leftovers: SummaryRow[] = [];
    for (const [key, raw] of Object.entries(source)) {
        if (used.has(key) || SENSITIVE_KEYS.has(key)) continue;
        const value = toText(raw);
        if (value) leftovers.push({label: humanize(key), value});
    }
    if (leftovers.length > 0) sections.push({title: leftoverTitle, rows: leftovers});

    return sections;
}

/** Builds the review sections from the submitted details and medical answers. */
export function buildSummarySections(details: object, medical: object): SummarySection[] {
    return [
        ...collect(
            details as Record<string, unknown>,
            [PERSONAL_GROUP, ENROLLMENT_GROUP, ADDRESS_GROUP, EMERGENCY_GROUP],
            "Other details",
        ),
        ...collect(medical as Record<string, unknown>, MEDICAL_GROUPS, "Other medical history"),
    ];
}

type RegistrationPreviewProps = {
    sections: SummarySection[];
    onEdit: () => void;
    onConfirm: () => void;
    isSubmitting?: boolean;
};

export default function RegistrationPreview({
    sections,
    onEdit,
    onConfirm,
    isSubmitting = false,
}: RegistrationPreviewProps) {
    const [pageIndex, setPageIndex] = useState(0);

    const total = Math.max(sections.length, 1);
    const isLastPage = pageIndex >= total - 1;
    const section = sections[pageIndex];

    const goTo = (index: number) => {
        setPageIndex(index);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="mb-2 flex items-center justify-between text-xs text-textMuted">
                    <span>
                        Page {pageIndex + 1} of {total}
                    </span>
                    <span className="font-medium text-textPrimary">
                        {section?.title ?? "Review"}
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{width: `${((pageIndex + 1) / total) * 100}%`}}
                    />
                </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-info/30 bg-info/10 px-4 py-3.5 text-sm text-info">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                <p>Your account stays pending until medical personnel approve it.</p>
            </div>

            {section && (
                <section key={section.title} className="flex flex-col gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {section.title}
                    </h3>

                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl border border-border bg-white p-5 sm:grid-cols-2">
                        {section.rows.map((row, index) => (
                            <div key={`${row.label}-${index}`} className="min-w-0">
                                <dt className="text-xs font-medium text-textMuted">{row.label}</dt>
                                <dd className="mt-0.5 break-words text-sm text-textPrimary">
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-border bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
                {pageIndex > 0 ? (
                    <button
                        type="button"
                        onClick={() => goTo(pageIndex - 1)}
                        disabled={isSubmitting}
                        className={secondaryButton}
                    >
                        Back
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onEdit}
                        disabled={isSubmitting}
                        className={secondaryButton}
                    >
                        Edit details
                    </button>
                )}

                {!isLastPage ? (
                    <button
                        type="button"
                        onClick={() => goTo(pageIndex + 1)}
                        className={primaryButton}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={primaryButton}
                    >
                        {isSubmitting ? "Submitting..." : "Confirm and submit"}
                    </button>
                )}
            </div>
        </div>
    );
}