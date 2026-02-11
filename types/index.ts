export interface Employee {
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
    created_at: string;
}

export interface Attendance {
    id: number;
    employee_id: string
    employee_name: string;
    department?: string;
    date: string;
    status: 'Present' | 'Absent';
    created_at: string;
}

export interface AttendanceCreate {
    employee_id: string;
    date: string;
    status: 'Present' | 'Absent';
}
