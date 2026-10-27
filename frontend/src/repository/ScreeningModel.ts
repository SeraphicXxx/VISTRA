import { ScreeningPredictionData } from "/@/api/schema/ScreeningSchema";
import { HealthRiskPrediction } from "/@/pages/patient/overview/healthRisk";

export function mapScreeningToHealthRisks(
    data: ScreeningPredictionData,
    inputs: {
        bmi:number;
        age: number
    }
): HealthRiskPrediction[]{

    const {hypertension, type_2_diabetes} = data.screening_results;

    const bmiCategory = 
        inputs.bmi < 18.5
            ? "Underweight"
            : inputs.bmi < 25
            ? "Normal Weight"
            : inputs.bmi < 30
            ? "Overweight"
            : "Obese";

    const commonFactors = [
        `BMI : ${inputs.bmi.toFixed(1)} (${bmiCategory})`,
        `Age : ${inputs.age} years`,
    ];

    return [
         {
            condition: "Hypertension",
            percent: Math.round(hypertension.risk_probability),
            explanation:
                hypertension.risk_probability >= 50
                    ? "Elevated risk profile detected based on current age and BMI indicators. We suggest scheduling a blood pressure evaluation."
                    : "Biometric indicators fall within the normal cardiovascular screening baseline.",
            factors: [...commonFactors, `Triage: ${hypertension.triage_flag}`],
        },
        {
            condition: "Type 2 diabetes",
            percent: Math.round(type_2_diabetes.risk_probability),
            explanation:
                type_2_diabetes.risk_probability >= 50
                    ? "Higher probability score calculated from metabolic indicators. Routine blood sugar check is advised."
                    : "Biometric and metabolic indicators reflect standard baseline risk levels.",
            factors: [...commonFactors, `Triage: ${type_2_diabetes.triage_flag}`],
        },
    ];

}