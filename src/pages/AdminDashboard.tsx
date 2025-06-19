
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Calendar, Settings, Plus } from "lucide-react";
import { mockSubjects, mockLecturers, mockVenues, mockClasses } from "@/data/mockData";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Students", value: "1,234", icon: Users, color: "bg-blue-500" },
    { label: "Active Classes", value: mockClasses.length.toString(), icon: BookOpen, color: "bg-green-500" },
    { label: "Subjects", value: mockSubjects.length.toString(), icon: Calendar, color: "bg-purple-500" },
    { label: "Lecturers", value: mockLecturers.length.toString(), icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your timetable system</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Classes */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Classes
            </CardTitle>
            <CardDescription>Latest scheduled classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockClasses.slice(0, 3).map((classItem) => {
              const subject = mockSubjects.find(s => s.id === classItem.subjectId);
              const lecturer = mockLecturers.find(l => l.id === classItem.lecturerId);
              
              return (
                <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{subject?.name}</p>
                    <p className="text-sm text-gray-600">{lecturer?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {classItem.dayOfWeek} {classItem.startTime} - {classItem.endTime}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {classItem.enrolledStudents}/{classItem.maxStudents}
                  </Badge>
                </div>
              );
            })}
            <Button variant="outline" className="w-full">
              View All Classes
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Timetable Generator</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Backup</span>
              <span className="text-sm text-gray-600">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Sessions</span>
              <span className="text-sm text-gray-600">247 users</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
