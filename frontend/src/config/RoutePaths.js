export const ROUTES = {
    public: {
        home: "/",
    },

    admin: {
        home: "/staff",
        login: "/login",

        dashboard: {
            overview: "/staff/dashboard/overview",
            medical: "/staff/dashboard/medical",
            dental: "/staff/dashboard/dental",
            appointments: "/staff/dashboard/appointments",
        },
       medical: {
            viewRecord: "/staff/medical/records/view",
            createNewRecord: "/staff/medical/new",
        },
        appointment: {
            createNewRecord: "/staff/appointment/new",
        },
        dental: {
            createNewRecord: "/staff/dental/new",
            viewRecord: "/staff/dental/records/view",

        },
        patient: {

        }
    },
};