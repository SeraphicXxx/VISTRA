export const ROUTES = {
    public: {
        home: "/",
    },

    admin: {
        home: "/admin",
        login: "/login",

        dashboard: {
            overview: "/admin/dashboard/overview",
            medical: "/admin/dashboard/medical",
            dental: "/admin/dashboard/dental",
            appointments: "/admin/dashboard/appointments",
            patients: "/admin/dashboard/patients"
            ,
        },

       medical: {
            viewRecord: "/admin/medical/records/view",
            createNewRecord: "/admin/medical/new",
        },
        dental: {
            createNewRecord: "/admin/dental/new",
            viewRecord: "/admin/dental/records/view",

        },
        patient: {
            createNewRecord: "/admin/patient/new",
            viewRecord: "/admin/patient/records/view"
        },
    },
};