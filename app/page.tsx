import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">HRMS Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Employee Card */}
        <Link href="/employees">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Manage employee records, add new employees, and view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View all employees →
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Attendance Card */}
        <Link href="/attendance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>
                Mark daily attendance and view attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Mark attendance →
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
