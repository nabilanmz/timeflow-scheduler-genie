import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Clock, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Section } from "@/types/api";

const BrowseSections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get<{ data: Section[] }>('/sections?include=subject,lecturer,timetableEntries.day,timetableEntries.timeSlot');
        setSections(response.data);
      } catch (err) {
        setError("Failed to fetch sections. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const filteredSections = sections.filter(section => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      section.subject?.name.toLowerCase().includes(searchTermLower) ||
      section.subject?.code.toLowerCase().includes(searchTermLower) ||
      section.lecturer?.name.toLowerCase().includes(searchTermLower) ||
      String(section.section_number).toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Sections</h1>
          <p className="text-gray-600">Loading sections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

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
        {filteredSections.map((section) => {
          const classes = section.timetable_entries || [];
          return (
            <Card key={section.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {section.subject?.name} - Section {section.section_number}
                    </CardTitle>
                    <CardDescription>{section.subject?.code}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {classes.length} class{classes.length !== 1 ? 'es' : ''}
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
                  <span>{section.enrolled_students || 0}/{section.max_students || 'N/A'} students</span>
                </div>

                {classes.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Class Schedule:</p>
                    <div className="space-y-1">
                      {classes.map(classItem => (
                        <div key={classItem.id} className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span className="capitalize">
                            {classItem.day.name} {classItem.time_slot.start_time}-{classItem.time_slot.end_time}
                          </span>
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {classItem.activity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseSections;
