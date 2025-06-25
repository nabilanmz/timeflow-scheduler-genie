import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/types/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, subjectsRes, requestsRes] = await Promise.all([
          api.get("/api/users"),
          api.get("/api/subjects"),
          api.get("/api/timetable-change-requests?status=pending"),
        ]);

        const students = usersRes.data.filter((u: User) => !u.is_admin).length;

        setStats({
          students: students,
          subjects: subjectsRes.data.length,
          pendingRequests: requestsRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-xl text-gray-600">Overview of your institution's timetable system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pending Requests
            </CardTitle>
            <CardDescription>Review and approve timetable change requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingRequests}</div>
            <p className="text-sm text-gray-500">requests awaiting your review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Manage Subjects
            </CardTitle>
            <CardDescription>Add, edit, or remove subjects from the curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.subjects}</div>
            <p className="text-sm text-gray-500">subjects currently in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Manage People
            </CardTitle>
            <CardDescription>Manage student and lecturer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.students}</div>
            <p className="text-sm text-gray-500">active students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
