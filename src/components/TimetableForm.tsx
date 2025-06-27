import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Settings, Loader2 } from "lucide-react";
import SubjectSelector from "./SubjectSelector";
import DaySelector from "./DaySelector";
import TimeSelector from "./TimeSelector";
import LecturerSelector from "./LecturerSelector";
import api from "@/lib/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TimeSlot } from "@/types/api";

export interface TimetablePreferences {
  subjects: number[];
  days: number[];
  start_time: string;
  end_time: string;
  lecturers: number[];
  enforce_ties: 'yes' | 'no';
  mode: 1 | 2; // 1=compact, 2=spaced_out
}

export interface AvailableOptions {
  subjects: { id: number; name: string; code: string }[];
  lecturers: { id: number; name: string }[];
  timeSlots?: { id: number; start_time: string; end_time: string }[];
}

const TimetableForm = () => {
  const [preferences, setPreferences] = useState<TimetablePreferences>({
    subjects: [],
    days: [],
    start_time: "08:00",
    end_time: "18:00",
    lecturers: [],
    enforce_ties: 'yes',
    mode: 1,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<AvailableOptions | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get("/api/preference-options");
        setAvailableOptions(response.data);
      } catch (error) {
        console.error("Error fetching preference options:", error);
        toast({
          title: "Error",
          description: "Could not fetch available options.",
          variant: "destructive",
        });
      }
    };

    fetchOptions();
  }, []);

  // Filter time slots based on selected subjects
  useEffect(() => {
    const fetchSubjectTimeSlots = async () => {
      if (preferences.subjects.length === 0) {
        setFilteredTimeSlots([]);
        return;
      }

      try {
        // Fetch available time slots for selected subjects
        const response = await api.get(`/api/available-timeslots?subject_ids=${preferences.subjects.join(',')}`);

        if (response.data && Array.isArray(response.data)) {
          setFilteredTimeSlots(response.data);
        } else {
          // Fallback to all time slots if no specific data
          const allSlotsResponse = await api.get("/api/timeslots");
          setFilteredTimeSlots(allSlotsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching subject time slots:", error);
        // Fallback to all time slots on error
        try {
          const allSlotsResponse = await api.get("/api/timeslots");
          setFilteredTimeSlots(allSlotsResponse.data || []);
        } catch (fallbackError) {
          console.error("Error fetching fallback time slots:", fallbackError);
          setFilteredTimeSlots([]);
        }
      }
    };

    fetchSubjectTimeSlots();
  }, [preferences.subjects]);

  const handleSubmit = async () => {
    // Validation
    if (preferences.subjects.length === 0) {
      toast({
        title: "Please select at least one subject",
        variant: "destructive",
      });
      return;
    }

    if (preferences.days.length === 0) {
      toast({
        title: "Please select at least one day",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Sending preferences:", preferences);

      // Ensure time format is HH:MM (remove seconds if present)
      const formattedPreferences = {
        ...preferences,
        start_time: preferences.start_time.substring(0, 5),
        end_time: preferences.end_time.substring(0, 5),
      };

      // Generate timetable directly (no need to save preferences separately)
      const response = await Promise.race([
        api.post("/api/generate-timetable", { preferences: formattedPreferences }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 30000) // 30 second timeout
        )
      ]);

      toast({
        title: "Timetable generated successfully!",
        description: "Your new timetable has been created and is now active.",
      });

    } catch (error: any) {
      console.error("Error during timetable generation:", error);

      // Handle timeout specifically
      if (error.message === 'Timeout') {
        toast({
          title: "Request timed out",
          description: "Timetable generation is taking longer than expected. Please try with fewer subjects or simpler preferences.",
          variant: "destructive",
        });
        return;
      }

      // Handle different error types
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || {};
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]: [string, any]) =>
            Array.isArray(messages) ? `${field}: ${messages.join(', ')}` : `${field}: ${messages}`
          )
          .join('\n');

        toast({
          title: "Validation Error",
          description: errorMessages || "Please check your preferences and try again.",
          variant: "destructive",
        });
      } else if (error.response?.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate a timetable.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "An error occurred",
          description: error.response?.data?.message || "Could not generate timetable. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePreferences = (key: keyof TimetablePreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubjectsChange = (subjects: number[]) => {
    setPreferences(prev => ({
      ...prev,
      subjects,
      lecturers: [], // Reset lecturers when subjects change
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Timetable Preferences
          </CardTitle>
          <CardDescription className="text-base">
            Fill in your preferences below to generate your personalized timetable
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Subjects Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Preferred Subjects</h3>
            </div>
            <SubjectSelector
              selectedSubjects={preferences.subjects}
              onSubjectsChange={handleSubjectsChange}
            />
          </div>

          {/* Days Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Available Days</h3>
            </div>
            <DaySelector
              selectedDays={preferences.days}
              onDaysChange={(days) => updatePreferences('days', days)}
            />
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Time Preferences</h3>
              {preferences.subjects.length > 0 && (
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Filtered by selected subjects
                </span>
              )}
            </div>
            {preferences.subjects.length === 0 && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                ⚠️ Please select subjects first to see available time slots for your chosen courses.
              </p>
            )}
            <TimeSelector
              startTime={preferences.start_time}
              endTime={preferences.end_time}
              onTimeChange={(startTime, endTime) => {
                updatePreferences('start_time', startTime);
                updatePreferences('end_time', endTime);
              }}
              selectedSubjects={preferences.subjects}
              availableTimeSlots={filteredTimeSlots}
            />
          </div>

          {/* Lecturers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Preferred Lecturers</h3>
              <span className="text-sm text-gray-500">(Optional)</span>
            </div>
            <LecturerSelector
              selectedLecturers={preferences.lecturers}
              onLecturersChange={(lecturers) => updatePreferences('lecturers', lecturers)}
              availableLecturers={availableOptions?.lecturers}
              disabled={preferences.subjects.length === 0}
            />
          </div>

          {/* Enforce Ties Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Tied Sections</h3>
            </div>
            <RadioGroup
              value={preferences.enforce_ties}
              onValueChange={(value: 'yes' | 'no') =>
                updatePreferences('enforce_ties', value)
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ties-yes" />
                <Label htmlFor="ties-yes">Enforce ties (recommended)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ties-no" />
                <Label htmlFor="ties-no">Allow separate selection</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500">
              Enforcing ties automatically includes required tutorial/lab sections with lectures.
            </p>
          </div>

          {/* Schedule Mode Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Schedule Mode</h3>
            </div>
            <RadioGroup
              value={preferences.mode.toString()}
              onValueChange={(value: string) =>
                updatePreferences('mode', parseInt(value) as 1 | 2)
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="mode-compact" />
                <Label htmlFor="mode-compact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="mode-spaced" />
                <Label htmlFor="mode-spaced">Spaced Out</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500">
              Compact schedules minimize gaps, while spaced out schedules maximize breaks between classes.
            </p>
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Preferences Summary:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Subjects:</span> {preferences.subjects.length} selected
              </div>
              <div>
                <span className="font-medium">Days:</span> {preferences.days.length} selected
              </div>
              <div>
                <span className="font-medium">Time:</span> {preferences.start_time} - {preferences.end_time}
              </div>
              <div>
                <span className="font-medium">Lecturers:</span> {preferences.lecturers.length} selected (optional)
              </div>
              <div>
                <span className="font-medium">Tied Sections:</span> {preferences.enforce_ties === 'yes' ? 'Enforced' : 'Not enforced'}
              </div>
              <div>
                <span className="font-medium">Mode:</span> {preferences.mode === 1 ? 'Compact' : 'Spaced Out'}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Generating... (may take up to 30 seconds)
                </>
              ) : (
                'Generate My Timetable'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetableForm;
