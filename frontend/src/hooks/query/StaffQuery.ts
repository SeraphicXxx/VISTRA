import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {StaffModel} from "/@/repository/StaffModel";
import {deleteStaff, getAllStaff} from "/@/api/staff.api";

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
