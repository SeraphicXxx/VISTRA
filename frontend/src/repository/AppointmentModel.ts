import {AppointmentSchema} from "/@/api/schema/AppointmentSchema";
import {AppointmentPageFormat, AppointmentTableFormat} from "/@/pages/admin/appointments/appointmentsData";
import {formatDate, formatTime} from "/@/utils/FormatDate";
import {joinName} from "/@/utils/joinName";

export function toAppointmentTableRow(appointment: AppointmentSchema): AppointmentTableFormat {
    return {
        id: appointment.id,
        studentId: appointment.patient_id,
        student: joinName([
            appointment.first_name,
            appointment.middle_name,
            appointment.last_name,
        ]),
        course: appointment.course,
        time: formatDate(appointment.scheduled_start),
        type: appointment.reason,
        status: appointment.status
    };
}

export function toAppointmentPageFormat(appointment: AppointmentSchema): AppointmentPageFormat {
    return {
        id: appointment.id,
        studentId: appointment.patient_id,
        student: joinName([
            appointment.first_name,
            appointment.middle_name,
            appointment.last_name,
        ]),
        course: appointment.course,
        time: formatTime(appointment.scheduled_start),
        date: formatDate(appointment.scheduled_start),
        type: appointment.reason,
        notes: appointment.notes,
        declineReason: appointment.decline_reason,
        status: appointment.status
    };
}
