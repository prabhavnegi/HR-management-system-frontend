import axios from 'axios';
import { Employee, Attendance, AttendanceCreate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/employees/');
    return response.data;
  },

  create: async (data: Omit<Employee, 'created_at'>): Promise<Employee> => {
    const response = await api.post('/employees/', data);
    return response.data;
  },

  delete: async (employeeId: string): Promise<void> => {
    await api.delete(`/employees/${employeeId}/`);
  },
};

export const attendanceApi = {
  getAll: async (params?: { employee_id?: string; date?: string }): Promise<Attendance[]> => {
    const response = await api.get('/attendance/', { params });
    return response.data;
  },

  create: async (data: AttendanceCreate): Promise<Attendance> => {
    const response = await api.post('/attendance/', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}/`);
  },
};
