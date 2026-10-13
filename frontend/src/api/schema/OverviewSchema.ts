export interface WeeklyAppointmentsBucket {
    day: string;
    value: number;
}

export interface VisitMix {
    medical: number;
    dental: number;
    ojt: number;
    other: number;
}

export interface OverviewStatsSchema {
    appointments_today: number;
    appointments_yesterday: number;
    medical_today: number;
    medical_yesterday: number;
    dental_today: number;
    dental_yesterday: number;
    active_staff: number;
    records_today: number;
    in_consultation: number;
    weekly_appointments: WeeklyAppointmentsBucket[];
    visit_mix: VisitMix;
}
