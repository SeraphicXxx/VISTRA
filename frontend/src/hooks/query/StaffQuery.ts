import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {StaffModel} from "/@/repository/StaffModel";
import {deleteStaff, getAllStaff, updateStaffPermissions, updateStaffRole, createStaff} from "/@/api/staff.api";
import type {UpdateStaffPermissions, CreateStaffRequest} from "/@/api/schema/StaffSchema";

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

export function useUpdateStaffPermissions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({staffId, payload}: {staffId: string; payload: UpdateStaffPermissions}) => {
            const {data} = await updateStaffPermissions(staffId, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["staff"]});
        },
    });
}

export function useUpdateStaffRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({staffId, role}: {staffId: string; role: string}) => {
            const {data} = await updateStaffRole(staffId, role);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["staff"]});
        },
    });
}
