import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, Users } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Subject as SubjectType } from "@/types/api";

const BrowseSubjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get<{ data: SubjectType[] }>('/api/subjects?include=sections.lecturer');
        setSubjects(response.data);
      } catch (err) {
        setError("Failed to fetch subjects. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Subjects</h1>
          <p className="text-gray-600">Loading subjects...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Subjects</h1>
        <p className="text-gray-600">Explore available subjects and their details</p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by subject name, code, or description..."
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

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => {
          const sections = subject.sections || [];
          const totalEnrolled = sections.reduce((sum, section) => sum + (section.enrolled_students || 0), 0);
          const totalCapacity = sections.reduce((sum, section) => sum + (section.max_students || 0), 0);

          return (
            <Card key={subject.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>{subject.code}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {subject.credits} credits
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{subject.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{totalEnrolled}/{totalCapacity} students enrolled</span>
                </div>

                {sections.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Sections:</p>
                    <div className="flex flex-wrap gap-1">
                      {sections.map(section => {
                        const lecturerName = section.lecturer ? section.lecturer.name.split(' ').pop() : 'N/A';
                        return (
                          <Badge key={section.id} variant="secondary" className="text-xs">
                            Section {section.section_number} - {lecturerName}
                          </Badge>
                        );
                      })}
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

export default BrowseSubjects;
