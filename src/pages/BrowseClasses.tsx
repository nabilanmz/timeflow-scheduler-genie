import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { TimetableEntry } from "@/types/api";

const BrowseClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetableEntries = async () => {
      try {
        const response = await api.get<{ data: TimetableEntry[] }>('/timetable-entries?include=subject,lecturer,day,time_slot');
        setTimetableEntries(response.data);
      } catch (err) {
        setError("Failed to fetch classes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableEntries();
  }, []);

  const filteredEntries = timetableEntries.filter(entry => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      entry.subject.name.toLowerCase().includes(searchTermLower) ||
      entry.subject.code.toLowerCase().includes(searchTermLower) ||
      entry.lecturer.name.toLowerCase().includes(searchTermLower) ||
      entry.venue.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Classes</h1>
          <p className="text-gray-600">Loading classes...</p>
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
            <Input
              placeholder="Search by subject, lecturer, or venue..."
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

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{entry.subject.name}</CardTitle>
                  <CardDescription>{entry.subject.code}</CardDescription>
                </div>
                <Badge variant={entry.activity.toLowerCase() === 'lecture' ? 'default' : 'secondary'}>
                  {entry.activity}
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
                <span>{entry.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{entry.day.name} {entry.time_slot.start_time} - {entry.time_slot.end_time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrowseClasses;
