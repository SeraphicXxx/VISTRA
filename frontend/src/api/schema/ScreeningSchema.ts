export interface ScreeningPredictRequest {
    bmi: number;
    age: number;
    sex: "Male" | "Female" | string | number;
}

export interface ConditionResult {
    risk_probability: number;
    triage_flag: string;
}

export interface ScreeningResults {
    hypertension: ConditionResult;
    type_2_diabetes: ConditionResult;
}

export interface ScreeningPredictionData {
    status: string;
    inputs_received: {
        bmi: number;
        age_bracket: number;
        sex: string;
    };

    screening_results: ScreeningResults;
}