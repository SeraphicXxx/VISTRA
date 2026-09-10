import {Column} from "/@/components/table/Table";
import {FilterColumn} from "/@/components/Filters";
import {avatarColor, getInitials} from "/@/components/avatar";
import React from "react";
// sample for view rec
// "20230847-S": {
//   medical: [
//     {
//       id: "MED-1001-1",
//       title: "Annual physical exam",
//       date: "2026-08-27",
//       details: "Vitals normal. BP 118/76, HR 72 bpm. Cleared for physical activity.",
//       provider: "Dr. Angela Ramos",
//     },
//     {
//       id: "MED-1001-2",
//       title: "Flu vaccination",
//       date: "2026-02-14",
//       details: "Seasonal influenza vaccine administered, left arm. No adverse reaction observed.",
//       provider: "Nurse Bea Villanueva",
//     },
//   ],
//       dental: [
//     {
//       id: "DEN-1001-1",
//       title: "Routine cleaning",
//       date: "2026-06-03",
//       details: "Mild plaque buildup on lower molars. Recommended electric toothbrush.",
//       provider: "Dr. Miko Tan",
//     },
//   ],
//       appointment: [
//     {
//       id: "APT-1001-1",
//       title: "Follow-up consultation",
//       date: "2026-09-10",
//       details: "Scheduled to review physical exam bloodwork results.",
//       provider: "Dr. Angela Ramos",
//     },
//   ],
// },

export interface patientData {
    id: string;
    name: string;
    patient_id: string;
    user_type: string;
    course: string;
    year_section: string;
    last_visit: string;
}

export const patientColumns: Column<patientData>[] = [
    {
        key: "name",
        label: "Name",
        render: (value) => {
            const student = value as string;

            return (
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarColor(student)}`}>
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
        key: "patient_id",
        label: "User ID"
    },
    {
        key: "user_type",
        label: "User Type"
    },
    {
        key: "course",
        label: "Course / Department"
    },
    {
        key: "year_section",
        label: "Year & Section"
    },
]

export const patientColumnsFilter: FilterColumn<patientData>[] = [
    {
        key: "user_type",
        label: "User Type",
        type: "select"
    },
    {
        key: "last_visit",
        label: "Last Visit",
        type: "date"
    }
]

export const patientColumnsFilterOption: Record<string, string[]> = {
    user_type: [
        "Student",
        "Professor",
        "Staff"
    ]
}

//DEPRECATED
export function getMockPatientRecords(patientId: number) {
    return (
        {
            medical: [],
            dental: [],
            appointment: [],
        }
    );
}
