export const ROUTES = {
    public: {
        home: "/",
    },

    admin: {
        home: "/admin",
        login: "/admin/login",

        dashboard: {
            overview: "/admin/dashboard/overview",
            medical: "/admin/dashboard/medical",
            dental: "/admin/dashboard/dental",
            appointments: "/admin/dashboard/appointments",
        },

        medical: {
            recordForm: "/admin/medical/medical-record-form",
            viewRecord: "/admin/medical/records/view",
        },
    },
};