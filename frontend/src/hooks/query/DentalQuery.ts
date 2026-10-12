import {CreateDentalVisit, DentalRecordDetailSchema, DentalVisitSchema, UpdateDentalVisit} from "/@/api/schema/DentalSchema";
import {createDentalVisit, getDentalRecordById, getDentalVisit, updateDentalVisit} from "/@/api/dental.api";

import {DentalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {ApiMessageResponse} from "/@/api/schema/ApiResponseSchema";
import {createDetailQueryHook, createListQueryHook, createMutationHook, createUpdateMutationHook} from "/@/hooks/query/visitQuery";

export const useCreateDentalVisit = createMutationHook<CreateDentalVisit, ApiMessageResponse>(createDentalVisit);

export const useDentalQuery = createListQueryHook<DentalVisitFilters, PaginatedData<DentalVisitSchema>>(
    "dental",
    getDentalVisit,
    "Dental data is missing",
);

export const useDentalVisitDetail = createDetailQueryHook<DentalRecordDetailSchema>(
    "dental",
    getDentalRecordById,
    "Dental record is missing",
);

interface UpdateDentalVisitArgs {
    patientId: string;
    dentalId: string;
    payload: UpdateDentalVisit;
}

export const useUpdateDentalVisit = createUpdateMutationHook<UpdateDentalVisitArgs, unknown>(
    (args) => updateDentalVisit(args.patientId, args.dentalId, args.payload)
);
