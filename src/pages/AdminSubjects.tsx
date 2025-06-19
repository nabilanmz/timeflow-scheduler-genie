
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSubjects, mockSections, mockVenues, getSectionsBySubject, getSubjectById, getLecturerById } from "@/data/mockData";
import { BookOpen, MapPin, Layers } from "lucide-react";

const AdminSubjects = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Management</h1>
        <p className="text-xl text-gray-600">Manage subjects, sections, and venues</p>
      </div>

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Management</CardTitle>
              <CardDescription>View and manage all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <p className="text-sm text-gray-600">{subject.code} - {subject.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{subject.credits} credits</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Section Management</CardTitle>
              <CardDescription>View and manage sections for all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Lecturer</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSections.map((section) => {
                    const subject = getSubjectById(section.subjectId);
                    const lecturer = getLecturerById(section.lecturerId);
                    
                    return (
                      <TableRow key={section.id}>
                        <TableCell>{subject?.name}</TableCell>
                        <TableCell>Section {section.sectionNumber}</TableCell>
                        <TableCell>{lecturer?.name}</TableCell>
                        <TableCell>
                          <Badge variant={section.enrolledStudents >= section.maxStudents ? "destructive" : "default"}>
                            {section.enrolledStudents}/{section.maxStudents}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Venue Management</CardTitle>
              <CardDescription>View and manage all venues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockVenues.map((venue) => (
                  <div key={venue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="font-semibold">{venue.name}</h3>
                        <p className="text-sm text-gray-600">
                          {venue.building}, Floor {venue.floor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{venue.type}</Badge>
                      <Badge>{venue.capacity} seats</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSubjects;
