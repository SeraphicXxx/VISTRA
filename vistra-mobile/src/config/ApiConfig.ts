const isProd = process.env.EXPO_PUBLIC_IS_PROD === "true";

export const getApiUrl = (): string => {
    const url = isProd
        ? process.env.EXPO_PUBLIC_PROD_API_URL
        : process.env.EXPO_PUBLIC_API_URL;

    if (!url) {
        throw new Error(
            "API URL is not configured. Set EXPO_PUBLIC_API_URL in your .env file."
        );
    }

    return url;
};

// API major version prefix. Must match backend main.py API_V1_PREFIX.
// Health check stays unversioned by design.
const API_V1 = "/api/v1";

export const API_ENDPOINTS = {
    public: {
        health_check: "/api/health",
    },
    auth: {
        login: `${API_V1}/auth/login/`,
        refresh_token: `${API_V1}/auth/refresh/`,
        logout: `${API_V1}/auth/logout/`,
    },
    staff: {
        create_staff: `${API_V1}/staff/`,
        get_all_staff: `${API_V1}/staff/`,
        getStaffById: (staffId: string) => `${API_V1}/staff/${staffId}/`,
        delete_staff: (staffId: string) => `${API_V1}/staff/${staffId}/`,
        update_staff_access: (staffId: string) => `${API_V1}/staff/${staffId}/access`,
    },
    patient: {
        get_patients: `${API_V1}/patients/`,
        create_patient: `${API_V1}/patients/`,
        get_all_patient_profile: `${API_V1}/patients/profiles/`,
        get_summary_record: (patientId: string) =>
            `${API_V1}/patients/profiles/${patientId}/`,
        get_my_profile: `${API_V1}/patients/profiles/me/`,
        get_medical_dental_summary: `${API_V1}/patients/summary/medical-dental/`,
        get_patient_by_id: (patientId: string) =>
            `${API_V1}/patients/${patientId}/`,
        update_patient_profile: (patientId: string) =>
            `${API_V1}/patients/${patientId}/`,
        get_patient_medical_tab: `${API_V1}/patients/record/medical-tab/`,
        get_patient_dental_tab: `${API_V1}/patients/record/dental-tab/`,
    },
    appointment: {
        create_appointment: `${API_V1}/appointments/`,
        get_appointment: `${API_V1}/appointments/`,
        get_appointment_me: `${API_V1}/appointments/me/`,
        get_appointment_by_id: (
            patient_id: string,
            appointment_id: string
        ) => `${API_V1}/appointments/${patient_id}/${appointment_id}`,
        update_appointment: (
            patient_id: string,
            appointment_id: string
        ) => `${API_V1}/appointments/${patient_id}/${appointment_id}/`,
        delete_appointment: (appointment_id: number) =>
            `${API_V1}/appointments/${appointment_id}/`,
    },
    dental: {
        create_dental_visit: `${API_V1}/dental/`,
        get_dental_visit: `${API_V1}/dental/`,
        get_dental_record: (patientId: string, dentalId: string) =>
            `${API_V1}/dental/${patientId}/${dentalId}`,
        update_dental_visit: (patientId: string, dentalId: string) =>
            `${API_V1}/dental/${patientId}/${dentalId}/`,
        delete_dental_visit: (dental_visit_id: number) =>
            `${API_V1}/dental/${dental_visit_id}/`,
    },
    medical: {
        create_medical_visit: `${API_V1}/medical/`,
        get_medical_visit: `${API_V1}/medical/`,
        get_medical_record: (patientId: string, medicalId: string) =>
            `${API_V1}/medical/${patientId}/${medicalId}`,
        update_medical_visit: (patientId: string, medicalId: string) =>
            `${API_V1}/medical/${patientId}/${medicalId}/`,
        delete_medical_visit: (medical_visit_id: number) =>
            `${API_V1}/medical/${medical_visit_id}/`,
    },
    overview: {
        get_stats: `${API_V1}/overview/stats/`,
    },
};
