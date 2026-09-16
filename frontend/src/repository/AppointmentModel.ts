import {AppointmentSchema} from "/@/api/schema/AppointmentSchema";
import {Appointment} from "/@/pages/admin/appointments/appointmentsData";
import {formatDate} from "/@/utils/FormatDate";

export class AppointmentModel {
    private AppointmentSchema: AppointmentSchema

    constructor(appointmentSchema: AppointmentSchema) {
        this.AppointmentSchema = appointmentSchema;
    }

    tableFormat(): Appointment {
        return {
            id: this.AppointmentSchema.patient_id,

            student: [
                this.AppointmentSchema.first_name,
                this.AppointmentSchema.middle_name,
                this.AppointmentSchema.last_name,
            ]
                .filter(Boolean)
                .join(" "),
            course: this.AppointmentSchema.course,
            time: formatDate(this.AppointmentSchema.scheduled_start),
            type: this.AppointmentSchema.reason,
            status: this.AppointmentSchema.status
        };
    }
}