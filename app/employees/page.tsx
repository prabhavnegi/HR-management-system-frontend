'use client';

import { useState, useEffect } from 'react';
import { employeeApi } from '@/lib/api';
import { Employee } from '@/types';
import EmployeeList from '@/components/EmployeeList';
import EmployeeForm from '@/components/EmployeeForm';
import { toast } from 'sonner';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (error: any) {
      toast.error('Failed to fetch employees', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (data: Omit<Employee, 'created_at'>) => {
    try {
      setIsSubmitting(true);
      const newEmployee = await employeeApi.create(data);
      setEmployees([newEmployee, ...employees]);
      toast.success('Employee added successfully', {
        description: `${data.employee_id} - ${data.full_name}`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.employee_id?.[0] || 
                          error.response?.data?.email?.[0] || 
                          'Failed to add employee';
      toast.error('Failed to add employee', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
      return;
    }

    try {
      setIsDeleting(employeeId);
      await employeeApi.delete(employeeId);
      setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
      toast.success('Employee deleted successfully', {
        description: `${employeeId} has been removed`,
      });
    } catch (error: any) {
      toast.error('Failed to delete employee', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Total Employees: {employees.length}</p>
        </div>
      </div>

      <EmployeeForm onSubmit={handleAddEmployee} isSubmitting={isSubmitting} />

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Employees</h2>
        <EmployeeList
          employees={employees}
          onDelete={handleDeleteEmployee}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
