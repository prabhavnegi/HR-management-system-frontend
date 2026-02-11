'use client';

import { Attendance } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AttendanceTableProps {
  attendance: Attendance[];
  onDelete: (id: number) => void;
  isDeleting: number | null;
}

export default function AttendanceTable({ attendance, onDelete, isDeleting }: AttendanceTableProps) {
  if (attendance.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500 text-lg">No attendance records found</p>
        <p className="text-gray-400 text-sm mt-2">Mark attendance to see records here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employee_id}</TableCell>  {/* ← Changed */}
                <TableCell>{record.employee_name}</TableCell>
                <TableCell>{record.department || 'N/A'}</TableCell>
                <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                    <Badge
                    variant={record.status === 'Present' ? 'default' : 'destructive'}
                    className={record.status === 'Present' ? 'bg-green-600' : ''}
                    >
                    {record.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(record.id)}
                    disabled={isDeleting === record.id}
                    >
                    {isDeleting === record.id ? (
                        'Deleting...'
                    ) : (
                        <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                        </>
                    )}
                    </Button>
                </TableCell>
                </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
