
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLecturers, mockUsers } from "@/data/mockData";
import { User, Users } from "lucide-react";

const AdminPeople = () => {
  const students = mockUsers.filter(user => user.role === 'student');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">People Management</h1>
        <p className="text-xl text-gray-600">Manage lecturers and students</p>
      </div>

      <Tabs defaultValue="lecturers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="lecturers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lecturer Management</CardTitle>
              <CardDescription>View and manage all lecturers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockLecturers.map((lecturer) => (
                  <div key={lecturer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="font-semibold">{lecturer.name}</h3>
                        <p className="text-sm text-gray-600">{lecturer.department}</p>
                        <p className="text-sm text-gray-500">{lecturer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{lecturer.title}</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage all students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeople;
