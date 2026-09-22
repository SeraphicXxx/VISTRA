import {CreateDentalVisit} from "/@/api/schema/DentalSchema";
import {createDentalVisit} from "/@/api/dental.api";

import { useMutation } from "@tanstack/react-query";

export function useCreateDentalVisit() {
    return useMutation({
        mutationFn: async (record: CreateDentalVisit) => {
            const { data } = await createDentalVisit(record);
            return data;
        },
    });
}