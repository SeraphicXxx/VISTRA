import {Status, StatusBadge} from "/@/components/StatusBadge";
import {Column} from "/@/components/table/Table";
import {avatarColor, getInitials, getTypeIcon} from "/@/components/avatar";
import React from "react";

export const APPOINTMENTS: AppointmentTableFormat[] = [
    {
        id: "APT-1042",
        student: "Kenji Chua",
        course: "BS Computer Science",
        time: "9:00 AM",
        type: "Medical Consultation",
        status: "pending"
    },
    {
        id: "APT-1043",
        student: "Ivan Mejorada",
        course: "BS Business Administration",
        time: "9:30 AM",
        type: "Follow-up",
        status: "confirmed"
    },
    {
        id: "APT-1044",
        student: "Cjay Gonzales",
        course: "BS Psychology",
        time: "10:00 AM",
        type: "Dental Consultation",
        status: "declined"
    },
    {
        id: "APT-1045",
        student: "Joshua Lapitan",
        course: "BS Nursing",
        time: "10:15 AM",
        type: "Fit to Work Certificate",
        status: "pending"
    },
    {
        id: "APT-1046",
        student: "Gillian Marc Lorenzo",
        course: "BS Information Technology",
        time: "10:30 AM",
        type: "Medical Consultation",
        status: "confirmed"
    },
    {
        id: "APT-1047",
        student: "Angel Emie Jane Bien",
        course: "BS Computer Science",
        time: "11:00 AM",
        type: "Dental Consultation",
        status: "pending"
    },
    {
        id: "APT-1048",
        student: "Maria Santos",
        course: "BS Education",
        time: "11:30 AM",
        type: "Follow-up",
        status: "confirmed"
    },
    {
        id: "APT-1049",
        student: "Daniel Reyes",
        course: "BS Accountancy",
        time: "12:00 PM",
        type: "Medical Consultation",
        status: "pending"
    },
    {
        id: "APT-1050",
        student: "Sofia Cruz",
        course: "BS Psychology",
        time: "1:00 PM",
        type: "Dental Consultation",
        status: "confirmed"
    },
    {
        id: "APT-1051",
        student: "Mark Villanueva",
        course: "BS Information Technology",
        time: "1:30 PM",
        type: "Medical Consultation",
        status: "declined"
    },
    {
        id: "APT-1052",
        student: "Andrea Garcia",
        course: "BS Nursing",
        time: "2:00 PM",
        type: "Follow-up",
        status: "pending"
    },
    {
        id: "APT-1053",
        student: "Carlo Mendoza",
        course: "BS Business Administration",
        time: "2:30 PM",
        type: "Fit to Work Certificate",
        status: "confirmed"
    },
    {
        id: "APT-1054",
        student: "Leah Fernandez",
        course: "BS Computer Science",
        time: "3:00 PM",
        type: "Medical Consultation",
        status: "pending"
    },
    {
        id: "APT-1055",
        student: "Nathan Flores",
        course: "BS Psychology",
        time: "3:30 PM",
        type: "Dental Consultation",
        status: "confirmed"
    },
    {
        id: "APT-1056",
        student: "Bianca Ramos",
        course: "BS Education",
        time: "4:00 PM",
        type: "Medical Consultation",
        status: "declined"
    },
];

export interface AppointmentTableFormat {
    id: string;
    student: string;
    course: string;
    time: string;
    type: string;
    status: Status;
}

export interface AppointmentPageFormat {
    id: string;
    student: string;
    course: string;
    time: string;
    date: string;
    type: string;
    notes: string | null;
    decline_reason: string | null;
    status: Status;
}

export const AppointmentsColumns: Column<AppointmentTableFormat>[] = [
    {
        key: "student",
        label: "Student",
        render: (value) => {
            const student = value as string;

            return (
                <div className="flex items-center gap-2.5">
          <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(student)}`}
          >
      {getInitials(student)}
      </span>

                    <span className="text-sm font-medium text-textPrimary">
          {student}
          </span>
                </div>
            );
        },
    },
    {
        key: "course",
        label: "Course",
        filterType: "select",
        options: [
            "BS Computer Science",
            "BS Business Administration",
            "BS Psychology",
            "BS Nursing",
            "BS Information Technology",
            "BS Education",
            "BS Accountancy",

        ],
    },
    {
        key: "time",
        label: "Time",
        filterType: "date"
    },

    {
        key: "type",
        label: "Type",
        filterType: "select",
        options: [
            "Medical Consultation",
            "Dental Consultation",
            "Follow-up",
            "Fit to Work Certificate",
        ],
        render: (value) => {
            const type = value as string;
            const TypeIcon = getTypeIcon(type);

            return (
                <div className="flex items-center gap-1.5 text-sm text-textSecondary">
                    <TypeIcon
                        className="h-3.5 w-3.5 shrink-0 text-textMuted"
                        strokeWidth={2}
                    />
                    {type}
                </div>
            );
        },
    },

    {
        key: "status",
        label: "Status",
        filterType: "select",
        options: [
            "pending",
            "confirmed",
            "declined",
        ],
        render: (value) => (
            <StatusBadge status={value as Status}/>
        ),

    },
]