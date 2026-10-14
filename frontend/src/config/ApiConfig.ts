const isProd = import.meta.env.VITE_IS_PROD === "true";

export const getApiUrl = () => {
    return isProd
        ? import.meta.env.VITE_PROD_API_URL
        : import.meta.env.VITE_LOCAL_API_URL;
};

// API major version prefix. Must match backend main.py API_V1_PREFIX.
// Health check stays unversioned by design.
const API_V1 = "/api/v1";

export const API_ENDPOINTS = {
    public: {
        health_check: "/api/health",
    },
    auth:{
        login: `${API_V1}/auth/login/`,
        refresh_token: `${API_V1}/auth/refresh/`,
        logout: `${API_V1}/auth/logout/`,
    },
    staff: {
        create_staff: `${API_V1}/staff/`,
        getStaffById: (staffId: string) => `${API_V1}/staff/${staffId}/`,
    },
    patient: {
        get_patients: `${API_V1}/patients/`,
        create_patient: `${API_V1}/patients/`,
        get_all_patient_profile: `${API_V1}/patients/profiles/`,
        get_summary_record: (patientId: string) => `${API_V1}/patients/profiles/${patientId}/`,
        get_patient_by_id: (patientId: string) => `${API_V1}/patients/${patientId}/`,
        update_patient_profile: (patientId: string) => `${API_V1}/patients/${patientId}/`,
    },
    appointment: {
        create_appointment: `${API_V1}/appointments/`,
        get_appointment: `${API_V1}/appointments/`,
        get_appointment_by_id: (patient_id: string, appointment_id: string) => `${API_V1}/appointments/${patient_id}/${appointment_id}`,
        update_appointment: (patient_id: string, appointment_id: string) => `${API_V1}/appointments/${patient_id}/${appointment_id}/`,
    },
    dental: {
        create_dental_visit: `${API_V1}/dental/`,
        get_dental_visit: `${API_V1}/dental/`,
        get_dental_record: (patientId: string, dentalId: string) => `${API_V1}/dental/${patientId}/${dentalId}`,
        update_dental_visit: (patientId: string, dentalId: string) => `${API_V1}/dental/${patientId}/${dentalId}/`,
    },
    medical: {
        create_medical_visit: `${API_V1}/medical/`,
        get_medical_visit: `${API_V1}/medical/`,
        get_medical_record: (patientId: string, medicalId: string) => `${API_V1}/medical/${patientId}/${medicalId}`,
        update_medical_visit: (patientId: string, medicalId: string) => `${API_V1}/medical/${patientId}/${medicalId}/`,
    },
    overview: {
        get_stats: `${API_V1}/overview/stats/`,
    }
};