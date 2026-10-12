import {useQuery} from "@tanstack/react-query";
import {StaffModel} from "/@/repository/StaffModel";
import {getStaffById} from "/@/api/staff.api";


export function useStaffInfo(staffId: string) {
    const {
        data: staffData,
        isLoading,
        error,
    } = useQuery<StaffModel, Error> ({
        queryKey: ["staff", staffId],
        queryFn: async ({signal}) => {
            const {data: apiResponse} = await getStaffById(staffId, signal);

            if (!apiResponse?.data) {
                throw new Error(`Staff not found for ${staffId}`);
            }

            return new StaffModel(apiResponse.data);
        },
        enabled: !!staffId,
    });
    return {
        staffData: staffData ?? null,
        isLoading,
        error: error?.message ?? null,
    }
}
