import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Day, GeneratedTimetable, TimeSlot } from "@/types/api";

interface ClassData {
  subject: string;
  lecturer: string;
  venue: string;
  type: string;
}

const MyTimetable = () => {
  const [timetable, setTimetable] = useState<GeneratedTimetable | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timetableRes, daysRes, timeSlotsRes] = await Promise.all([
          api.get("/api/timetables"),
          api.get("/api/days"),
          api.get("/api/timeslots"),
        ]);
        setTimetable(timetableRes.data);
        setDays(daysRes.data);
        setTimeSlots(timeSlotsRes.data);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const timetableData = timetable?.timetable || {};

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
            <p>Loading timetable...</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-2 min-w-full">
                {/* Header */}
                <div className="p-2 text-center font-semibold text-gray-600">Time</div>
                {days.map(day => (
                  <div key={day.id} className="p-2 text-center font-semibold text-gray-600">
                    {day.name}
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots.map(time => (
                  <>
                    <div key={`time-${time.id}`} className="p-3 text-center text-sm text-gray-500 border-r">
                      {time.start_time.substring(0, 5)}
                    </div>
                    {days.map(day => {
                      const key = `${day.name}-${time.start_time.substring(0, 5)}`;
                      const classData = timetableData[key as keyof typeof timetableData] as ClassData | undefined;

                      return (
                        <div
                          key={key}
                          className="p-2 border border-gray-200 min-h-[80px] hover:bg-gray-50 transition-colors"
                        >
                          {classData && (
                            <div className="bg-blue-100 border border-blue-200 rounded-lg p-2 h-full">
                              <div className="text-xs font-semibold text-blue-800">
                                {classData.subject}
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {classData.lecturer}
                              </div>
                              <div className="text-xs text-blue-500">
                                {classData.venue}
                              </div>
                              <Badge className="mt-1 text-xs">
                                {classData.type}
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
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
