import type {ReactNode} from "react";
import PageNotFound from "/@/pages/public/PageNotFound";
import {useStaffInfo} from "/@/hooks/StaffInfo";
import {sessionManager} from "/@/utils/SessionManager";
import type {StaffPermissions} from "/@/api/schema/StaffSchema";

export type ModuleKey = keyof StaffPermissions;

interface RequireModuleProps {
    module: ModuleKey;
    children: ReactNode;
}

/**
 * Staff module gate: renders the page only when the signed-in
 * staff holds the STAFF_PERMISSIONS flag, else PageNotFound.
 * Overview has no flag (implicit base access) and stays unwrapped.
 * Patient routes are untouched (scoped server-side, not module-gated).
 */
export default function RequireModule({module, children}: RequireModuleProps) {
    const staffId = sessionManager.getUser()?.user_id ?? "";
    const {staffData, isLoading} = useStaffInfo(staffId);

    if (isLoading) {
        return null;
    }

    if (!staffData?.permissions?.[module]) {
        return <PageNotFound/>;
    }

    return <>{children}</>;
}
