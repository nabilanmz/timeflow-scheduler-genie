
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Edit, Plus } from "lucide-react";

const MyTimetable = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Mock timetable data
  const mockTimetable = {
    'Monday-09:00': { subject: 'Mathematics', lecturer: 'Dr. Sarah Johnson', venue: 'Main Hall A', type: 'lecture' },
    'Tuesday-10:00': { subject: 'Physics', lecturer: 'Prof. Michael Chen', venue: 'Main Hall A', type: 'lecture' },
    'Wednesday-14:00': { subject: 'Chemistry', lecturer: 'Dr. Emily Davis', venue: 'Lab 1', type: 'lab' },
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
          <CardDescription>Drag and drop to modify your timetable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-full">
              {/* Header */}
              <div className="p-2 text-center font-semibold text-gray-600">Time</div>
              {daysOfWeek.map(day => (
                <div key={day} className="p-2 text-center font-semibold text-gray-600">
                  {day}
                </div>
              ))}
              
              {/* Time slots */}
              {timeSlots.map(time => (
                <>
                  <div key={`time-${time}`} className="p-3 text-center text-sm text-gray-500 border-r">
                    {time}
                  </div>
                  {daysOfWeek.map(day => {
                    const key = `${day}-${time}`;
                    const classData = mockTimetable[key as keyof typeof mockTimetable];
                    
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
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-gray-600">Classes scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-sm text-gray-600">Contact hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-gray-600">Days off this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyTimetable;
