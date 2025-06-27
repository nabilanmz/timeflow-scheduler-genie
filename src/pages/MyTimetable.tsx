import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Edit, Plus, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { GeneratedTimetable } from "@/types/api";

interface TimetableEntry {
  code: string;
  subject: string;
  activity: string;
  section: string;
  days: string;
  start_time: string;
  end_time: string;
  venue: string;
  lecturer: string;
  tied_to?: string[];
}

const MyTimetable = () => {
  const [timetable, setTimetable] = useState<GeneratedTimetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await api.get("/api/my-timetable");
        setTimetable(response.data);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching timetable:", error);
        if (error.response?.status === 404) {
          setError("No active timetable found. Please generate a timetable first.");
        } else {
          setError("Failed to load timetable. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const getTimetableData = () => {
    if (!timetable?.timetable) return {};
    return timetable.timetable as Record<string, TimetableEntry[]>;
  };

  const getClassesAtTime = (day: string, time: string): TimetableEntry[] => {
    const timetableData = getTimetableData();
    const daySchedule = timetableData[day] || [];
    
    return daySchedule.filter(entry => {
      const entryStartTime = entry.start_time.substring(0, 5);
      return entryStartTime === time;
    });
  };

  const getActivityColor = (activity: string) => {
    switch (activity.toLowerCase()) {
      case 'lecture':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'tutorial':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'lab':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600 mt-2">Your personalized class schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Schedule
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Timetable Grid */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>Your weekly class schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading your timetable...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.href = '/student-dashboard'}>
                  Generate New Timetable
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-2 min-w-full">
                {/* Header */}
                <div className="p-2 text-center font-semibold text-gray-600">Time</div>
                {days.map(day => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600">
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots.map(time => (
                  <React.Fragment key={time}>
                    <div className="p-3 text-center text-sm text-gray-500 border-r">
                      {time}
                    </div>
                    {days.map(day => {
                      const classes = getClassesAtTime(day, time);

                      return (
                        <div
                          key={`${day}-${time}`}
                          className="p-2 border border-gray-200 min-h-[100px] hover:bg-gray-50 transition-colors"
                        >
                          {classes.map((classEntry, index) => (
                            <div
                              key={index}
                              className={`${getActivityColor(classEntry.activity)} border rounded-lg p-2 mb-2 last:mb-0`}
                            >
                              <div className="text-xs font-semibold">
                                {classEntry.code}
                              </div>
                              <div className="text-xs font-medium mt-1">
                                {classEntry.subject}
                              </div>
                              <div className="text-xs mt-1">
                                Section {classEntry.section}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {classEntry.lecturer}
                              </div>
                              <div className="text-xs text-gray-500">
                                {classEntry.venue}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <Badge className="text-xs" variant="secondary">
                                  {classEntry.activity}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {classEntry.start_time.substring(0, 5)}-{classEntry.end_time.substring(0, 5)}
                                </span>
                              </div>
                              {classEntry.tied_to && classEntry.tied_to.length > 0 && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Tied to: {classEntry.tied_to.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTimetable;
