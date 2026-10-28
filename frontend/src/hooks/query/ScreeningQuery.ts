import { useQuery } from "@tanstack/react-query";
import { predictScreening } from "/@/api/screening.api";
import { ScreeningPredictRequest } from "/@/api/schema/ScreeningSchema";
import { mapScreeningToHealthRisks } from "/@/repository/ScreeningModel";

export function useScreeningPredictionQuery(
    params: ScreeningPredictRequest | null,
    enabled = true
) {
    return useQuery({
        queryKey: ["screening", "predict", params],
        queryFn: async ({ signal }) => {
            if (!params) throw new Error("Missing parameters for prediction");

            const response = await predictScreening(params, signal);

            if (!response.data) {
                throw new Error("No prediction data returned from server");
            }

            return mapScreeningToHealthRisks(response.data, {
                bmi: params.bmi,
                age: params.age,
            });
        },
        enabled: Boolean(enabled && params && params.bmi > 0 && params.age > 0),
        staleTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
    });
}
