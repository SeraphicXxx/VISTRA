export const ROUTES = {
    public: {
        home: "/",
    },

    staff: {
        home: "/staff",
        login: "/login",
        dashboard: {
            overview: "/staff/dashboard/overview",
            medical: "/staff/dashboard/medical",
            dental: "/staff/dashboard/dental",
            appointments: "/staff/dashboard/appointments",
            patients: "/staff/dashboard/patients",
            accessControl: "/staff/dashboard/Access-Control-Management",
        },
        medical: {
            createNewRecord: "/staff/medical/new",
            view: {
                route: "/staff/medical/view/:patientId/:medicalId",

                build: (patientId: string, medicalId: string) =>
                    `/staff/medical/view/${patientId}/${medicalId}`,
            },
        },
        dental: {
            createNewRecord: "/staff/dental/new",
            view: {
                route: "/staff/dental/view/:patientId/:dentalId",

                build: (patientId: string, dentalId: string) =>
                    `/staff/dental/view/${patientId}/${dentalId}`,
            },
            viewRecord: "/staff/dental/view",
        },
        appointments: {
            view: {
                route: "/staff/appointments/view/:patientId/:appointmentId",

                build: (patientId: string, appointmentId: string) =>
                    `/staff/appointments/view/${patientId}/${appointmentId}`,
            },
        },
        patient: {
            createNewRecord: "/staff/patients/new",
            patientRecordTab: "/staff/patients/record",
        },
        accessControl: {
            manageStaff: "/staff/Access-Control-Management/new-staff",
        },
    },

    patient: {
        login: "/patient/login",
        dashboard: {
            overview: "/patient/dashboard/overview",
            appointments: "/patient/dashboard/appointments",
            medical: "/patient/dashboard/medical",
            dental: "/patient/dashboard/dental",
        },
        appointment: {
            bookAppointment: "/patient/appointments/book",
            viewAppointment: "/patient/appointments/view",
        },
        medical: {
            viewRecord: "/patient/dashboard/medical/record",
        },
        dental: {
            viewRecord: "/patient/dashboard/dental/record",
        },
        profile: "/patient/profile",
    },
};