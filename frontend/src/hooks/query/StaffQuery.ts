import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {StaffModel} from "/@/repository/StaffModel";
import {deleteStaff, getAllStaff, updateStaffAccess, createStaff} from "/@/api/staff.api";
import type {UpdateStaffAccess, CreateStaffRequest} from "/@/api/schema/StaffSchema";

export function useStaffList() {
    return useQuery({
        queryKey: ["staff", "list"],
        queryFn: async ({signal}) => {
            const {data: apiResponse} = await getAllStaff(signal);

            if (!apiResponse?.data) {
                throw new Error("Staff list is missing");
            }

            return apiResponse.data.map((row) => new StaffModel(row));
        },
        refetchOnWindowFocus: false,
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (staffId: string) => {
            const {data} = await deleteStaff(staffId);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["staff"]});
        },
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateStaffRequest) => {
            const {data} = await createStaff(payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["staff"]});
        },
    });
}

export function useUpdateStaffAccess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({staffId, payload}: {staffId: string; payload: UpdateStaffAccess}) => {
            const {data} = await updateStaffAccess(staffId, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["staff"]});
        },
    });
}
