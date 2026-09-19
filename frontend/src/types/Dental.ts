export type Dentition =
    | "permanent"
    | "temporary";

export type ToothCondition =
    | "sound"
    | "decayed"
    | "filled"
    | "missing"
    | "indicated_for_extraction"
    | "unerupted"
    | "supernumerary";

export const toothConditionOptions = [
    {value: "sound", label: "Sound"},
    {value: "decayed", label: "Decayed"},
    {value: "filled", label: "Filled"},
    {value: "missing", label: "Missing"},
    {
        value: "indicated_for_extraction",
        label: "Indicated for Extraction",
    },
    {value: "unerupted", label: "Unerupted"},
    {value: "supernumerary", label: "Supernumerary"},
] satisfies { value: ToothCondition; label: string }[];
type ToothRecord = {
    toothNumber: number;
    dentition: Dentition;
    condition: ToothCondition;
    notes: string;
};