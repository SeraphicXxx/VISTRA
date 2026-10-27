export interface Professional {
    id: string;
    name: string;
    role: string;
    course: string;
    email: string;
}

export interface MedicalNotification {
    professional: Professional;
    subject: string;
    message: string;
}

export const NOTIFY_PROFESSIONALS: Professional[] = [
    {
        id: "PRO-001",
        name: "Prof. Anthony Cruz",
        role: "Professor",
        course: "BS Computer Science",
        email: "maria.santos@vistra-university.test",
    },
    {
        id: "PRO-002",
        name: "Dr. Ramon Magdangal",
        role: "Associate Professor",
        course: "BS Information Technology",
        email: "ramon.cruz@vistra-university.test",
    },
    {
        id: "PRO-003",
        name: "Prof. Liza Ramos",
        role: "Assistant Professor",
        course: "BS Psychology",
        email: "liza.ramos@vistra-university.test",
    },
];