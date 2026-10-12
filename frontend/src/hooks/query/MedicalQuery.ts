import {createMedicalVisit, getMedicalRecordById, getMedicalVisit, updateMedicalVisit} from "/@/api/medical.api";
import {MedicalVisitFilters} from "/@/api/schema/FilterSchemaCollection";
import {CreateMedicalVisit, MedicalRecordDetailSchema, MedicalVisitSchema, UpdateMedicalVisit} from "/@/api/schema/MedicalSchema";
import {PaginatedData} from "/@/api/schema/ApiResponseSchema";
import {createDetailQueryHook, createListQueryHook, createMutationHook, createUpdateMutationHook} from "/@/hooks/query/visitQuery";
import {CreateMedicalVisitResponse} from "/@/api/schema/MedicalSchema";

export const useCreateMedicalVisit = createMutationHook<CreateMedicalVisit, CreateMedicalVisitResponse>(createMedicalVisit);

export const useMedicalQuery = createListQueryHook<MedicalVisitFilters, PaginatedData<MedicalVisitSchema>>(
    "medical",
    getMedicalVisit,
    "Medical data is missing",
);

export const useMedicalVisitDetail = createDetailQueryHook<MedicalRecordDetailSchema>(
    "medical",
    getMedicalRecordById,
    "Medical record is missing",
);

interface UpdateMedicalVisitArgs {
    patientId: string;
    medicalId: string;
    payload: UpdateMedicalVisit;
}

export const useUpdateMedicalVisit = createUpdateMutationHook<UpdateMedicalVisitArgs, unknown>(
    (args) => updateMedicalVisit(args.patientId, args.medicalId, args.payload)
);
