export const ROUTES = {
  public: { home: "/" },
  admin: {
    home: "/staff",
    login: "/login",
    dashboard: {
      overview: "/staff/dashboard/overview",
      medical: "/staff/dashboard/medical",
      dental: "/staff/dashboard/dental",
      appointments: "/staff/dashboard/appointments",
      patients: "/staff/dashboard/patients",
    },
    medical: {
      createNewRecord: "/staff/medical/new",
      viewRecord: "/staff/medical/view",
    },
    dental: {
      createNewRecord: "/staff/dental/new",
      viewRecord: "/staff/dental/view",
    },
    appointment: { viewAppointment: "/staff/appointments/view" },
    patient: {
      createNewRecord: "/staff/patients/new",
      patientRecordTab: "/staff/patients/record",
    },
  },
  /* Patient */ 
  
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
    profile: "/patient/profile",
  },
};
