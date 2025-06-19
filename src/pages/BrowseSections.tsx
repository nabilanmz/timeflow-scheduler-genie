
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, MapPin, Clock, BookOpen } from "lucide-react";
import { getSectionsWithDetails } from "@/data/mockData";
import { useState } from "react";

const BrowseSections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const sectionsWithDetails = getSectionsWithDetails();

  const filteredSections = sectionsWithDetails.filter(section =>
    section.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.subject?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.lecturer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.sectionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Sections</h1>
        <p className="text-gray-600">Explore available class sections</p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Search by subject, section, or lecturer..." 
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections.map((section) => (
          <Card key={section.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {section.subject?.name} - Section {section.sectionNumber}
                  </CardTitle>
                  <CardDescription>{section.subject?.code}</CardDescription>
                </div>
                <Badge variant="outline">
                  {section.classes.length} class{section.classes.length !== 1 ? 'es' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{section.lecturer?.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{section.enrolledStudents}/{section.maxStudents} students</span>
              </div>

              {section.classes.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Class Schedule:</p>
                  <div className="space-y-1">
                    {section.classes.map(classItem => (
                      <div key={classItem.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span className="capitalize">
                          {classItem.dayOfWeek} {classItem.startTime}-{classItem.endTime}
                        </span>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {classItem.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-600">
                  {section.enrolledStudents < section.maxStudents ? 'Available' : 'Full'}
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

export default BrowseSections;
