import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Settings, Loader2 } from "lucide-react";
import SubjectSelector from "./SubjectSelector";
import DaySelector from "./DaySelector";
import TimeSelector from "./TimeSelector";
import LecturerSelector from "./LecturerSelector";
import MaxDaysSelector from "./MaxDaysSelector";
import SectionSelector from "./SectionSelector";
import api from "@/lib/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface TimetablePreferences {
  subjects: string[];
  sections: string[];
  days: number[];
  start_time: string;
  end_time: string;
  lecturers: string[];
  max_days_per_week: number;
  schedule_style: 'compact' | 'spaced_out';
}

export interface AvailableOptions {
  days: { id: number; name: string }[];
  time_slots: { start_time: string; end_time: string }[];
  lecturers: { id: string; name: string }[];
  sections: { id: string; name: string }[];
}

const TimetableForm = () => {
  const [preferences, setPreferences] = useState<TimetablePreferences>({
    subjects: [],
    sections: [],
    days: [],
    start_time: "09:00",
    end_time: "17:00",
    lecturers: [],
    max_days_per_week: 5,
    schedule_style: 'compact',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<AvailableOptions | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (preferences.subjects.length > 0) {
        setIsLoadingOptions(true);
        try {
          const response = await api.get("/api/timetable-preferences/options", {
            params: {
              subjects: preferences.subjects,
            },
          });
          setAvailableOptions(response.data);

          // Filter out preferences that are no longer available
          setPreferences(prev => ({
            ...prev,
            sections: prev.sections.filter(sectionId =>
              response.data.sections.some((s: any) => s.id === sectionId)
            ),
            lecturers: prev.lecturers.filter(lecturerId =>
              response.data.lecturers.some((l: any) => l.id === lecturerId)
            ),
            days: prev.days.filter(dayId =>
              response.data.days.some((d: any) => d.id === dayId)
            ),
          }));

        } catch (error) {
          console.error("Error fetching timetable options:", error);
          toast({
            title: "Error",
            description: "Could not fetch options for the selected subjects.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingOptions(false);
        }
      } else {
        setAvailableOptions(null);
      }
    };

    fetchOptions();
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

    if (preferences.lecturers.length === 0) {
      toast({
        title: "Please select at least one lecturer",
        variant: "destructive",
      });
      return;
    }

    if (preferences.sections.length === 0) {
      toast({
        title: "Please select at least one section",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // First, save the preferences
      await api.post("/api/timetable-preferences", { preferences });
      toast({
        title: "Preferences saved!",
        description: "Your preferences have been saved successfully.",
      });

      // Then, trigger the generation
      await api.post("/api/generate-timetable", { preferences });
      toast({
        title: "Timetable generation started!",
        description: "Your new timetable is being generated. You will be notified when it's ready.",
      });

    } catch (error) {
      console.error("Error during timetable generation process:", error);
      toast({
        title: "An error occurred",
        description: "Could not complete the timetable request. Please try again.",
        variant: "destructive",
      });
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

  const handleSubjectsChange = (subjects: string[]) => {
    setPreferences(prev => ({
      ...prev,
      subjects,
      sections: [], // Reset sections when subjects change
      lecturers: [], // Also reset lecturers
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

          {/* Sections Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Preferred Sections</h3>
            </div>
            <SectionSelector
              selectedSections={preferences.sections}
              onSectionsChange={(sections) => updatePreferences('sections', sections)}
              selectedSubjects={preferences.subjects}
              availableSections={availableOptions?.sections}
              disabled={preferences.subjects.length === 0 || isLoadingOptions}
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
              availableDays={availableOptions?.days}
              disabled={isLoadingOptions}
            />
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Time Preferences</h3>
            </div>
            <TimeSelector
              startTime={preferences.start_time}
              endTime={preferences.end_time}
              onTimeChange={(startTime, endTime) => {
                updatePreferences('start_time', startTime);
                updatePreferences('end_time', endTime);
              }}
              availableTimeSlots={availableOptions?.time_slots}
              disabled={isLoadingOptions}
            />
          </div>

          {/* Lecturers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Preferred Lecturers</h3>
            </div>
            <LecturerSelector
              selectedLecturers={preferences.lecturers}
              onLecturersChange={(lecturers) => updatePreferences('lecturers', lecturers)}
              availableLecturers={availableOptions?.lecturers}
              disabled={preferences.subjects.length === 0 || isLoadingOptions}
            />
          </div>

          {/* Schedule Style Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Schedule Style</h3>
            </div>
            <RadioGroup
              value={preferences.schedule_style}
              onValueChange={(value: 'compact' | 'spaced_out') =>
                updatePreferences('schedule_style', value)
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r1" />
                <Label htmlFor="r1">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spaced_out" id="r2" />
                <Label htmlFor="r2">Spaced Out</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500">
              Compact schedules prioritize fewer days, while spaced out schedules distribute classes more evenly.
            </p>
          </div>

          {/* Max Days Section */}
          <div className="space-y-4">
            <MaxDaysSelector
              maxDays={preferences.max_days_per_week}
              onMaxDaysChange={(maxDays) => updatePreferences('max_days_per_week', maxDays)}
            />
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Preferences Summary:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Subjects:</span> {preferences.subjects.length} selected
              </div>
              <div>
                <span className="font-medium">Sections:</span> {preferences.sections.length} selected
              </div>
              <div>
                <span className="font-medium">Days:</span> {preferences.days.length} selected
              </div>
              <div>
                <span className="font-medium">Time:</span> {preferences.start_time} - {preferences.end_time}
              </div>
              <div>
                <span className="font-medium">Lecturers:</span> {preferences.lecturers.length} selected
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Max days per week:</span> {preferences.max_days_per_week}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Schedule Style:</span> <span className="capitalize">{preferences.schedule_style.replace('_', ' ')}</span>
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
                  Generating...
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
