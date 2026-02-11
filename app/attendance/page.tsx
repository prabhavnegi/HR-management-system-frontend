'use client';

import { useState, useEffect } from 'react';
import { employeeApi, attendanceApi } from '@/lib/api';
import { Employee, Attendance, AttendanceCreate } from '@/types';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceTable from '@/components/AttendanceTable';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [employeesData, attendanceData] = await Promise.all([
        employeeApi.getAll(),
        attendanceApi.getAll(),
      ]);
      setEmployees(employeesData);
      setAttendance(attendanceData);
    } catch (error: any) {
      toast.error('Failed to fetch data', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAttendance = async (data: AttendanceCreate) => {
    try {
        setIsSubmitting(true);
        await attendanceApi.create(data);
        await fetchData();  
        toast.success('Attendance marked successfully', {
        description: `${data.employee_id} - ${data.status}`,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.employee_id?.[0] ||
        'Failed to mark attendance';
      toast.error('Failed to mark attendance', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttendance = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      setIsDeleting(id);
      await attendanceApi.delete(id);
      setAttendance(attendance.filter((record) => record.id !== id));
      toast.success('Attendance record deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete attendance record', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFilter = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filterEmployeeId) params.employee_id = filterEmployeeId;
      if (filterDate) params.date = filterDate;
      
      const filteredData = await attendanceApi.getAll(params);
      setAttendance(filteredData);
    } catch (error: any) {
      toast.error('Failed to filter attendance', {
        description: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setFilterEmployeeId('');
    setFilterDate('');
    await fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Total Records: {attendance.length}</p>
        </div>
      </div>

      <AttendanceForm
        employees={employees}
        onSubmit={handleMarkAttendance}
        isSubmitting={isSubmitting}
      />

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Filter Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-employee">Employee ID</Label>
            <Input
              id="filter-employee"
              placeholder="e.g., EMP001"
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-date">Date</Label>
            <Input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div className="space-y-2 flex items-end gap-2">
            <Button onClick={handleFilter} className="flex-1">
              Apply Filters
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Records</h2>
        <AttendanceTable
          attendance={attendance}
          onDelete={handleDeleteAttendance}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
