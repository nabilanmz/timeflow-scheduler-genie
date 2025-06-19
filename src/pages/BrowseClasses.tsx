
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Users, MapPin, Clock } from "lucide-react";
import { mockClasses, mockSubjects, mockLecturers, mockVenues, getTimetableEntries } from "@/data/mockData";

const BrowseClasses = () => {
  const timetableEntries = getTimetableEntries();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Classes</h1>
        <p className="text-gray-600">Explore available classes and subjects</p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Search by subject, lecturer, or venue..." className="flex-1" />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timetableEntries.map((entry) => (
          <Card key={entry.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{entry.subject.name}</CardTitle>
                  <CardDescription>{entry.subject.code}</CardDescription>
                </div>
                <Badge variant={entry.type === 'lecture' ? 'default' : 'secondary'}>
                  {entry.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{entry.lecturer.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{entry.venue.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{entry.dayOfWeek} {entry.startTime} - {entry.endTime}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-600">
                  {entry.enrolledStudents}/{entry.maxStudents} students
                </span>
                <Button size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrowseClasses;
