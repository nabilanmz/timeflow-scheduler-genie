import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { TimeSlot } from "@/types/api";

interface TimeSelectorProps {
  startTime: string;
  endTime: string;
  onTimeChange: (startTime: string, endTime: string) => void;
  selectedSubjects?: number[];
  availableTimeSlots?: TimeSlot[];
}

const TimeSelector = ({ startTime, endTime, onTimeChange, selectedSubjects = [], availableTimeSlots }: TimeSelectorProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // Use provided timeSlots if available, otherwise fetch all
    if (availableTimeSlots) {
      setTimeSlots(availableTimeSlots);
    } else {
      const fetchTimeSlots = async () => {
        try {
          const res = await api.get("/api/timeslots");
          if (res.data && Array.isArray(res.data)) {
            setTimeSlots(res.data);
          } else {
            setTimeSlots([]);
          }
        } catch (error) {
          console.error("Error fetching time slots:", error);
          setTimeSlots([]);
        }
      };
      fetchTimeSlots();
    }
  }, [availableTimeSlots]);

  const handleStartTimeChange = (newStartTime: string) => {
    onTimeChange(newStartTime, endTime);
  };

  const handleEndTimeChange = (newEndTime: string) => {
    onTimeChange(startTime, newEndTime);
  };

  const quickTimePresets = [
    { label: "Morning (9 AM - 12 PM)", start: "09:00", end: "12:00" },
    { label: "Afternoon (1 PM - 5 PM)", start: "13:00", end: "17:00" },
    { label: "Full Day (9 AM - 5 PM)", start: "09:00", end: "17:00" },
    { label: "Extended (8 AM - 6 PM)", start: "08:00", end: "18:00" },
  ];

  return (
    <div className="space-y-4">
      {/* Quick presets */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Quick time presets:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickTimePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onTimeChange(preset.start, preset.end)}
              className={`p-3 text-left border rounded-lg transition-all duration-200 ${startTime === preset.start && endTime === preset.end
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                }`}
            >
              <div className="font-medium text-sm">{preset.label}</div>
              <div className="text-xs text-gray-600">{preset.start} - {preset.end}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom time inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium">
            Start Time
          </Label>
          <Select value={startTime} onValueChange={handleStartTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(slot => (
                <SelectItem key={`start-${slot.id}`} value={slot.start_time}>
                  {slot.start_time.substring(0, 5)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium">
            End Time
          </Label>
          <Select value={endTime} onValueChange={handleEndTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(slot => (
                <SelectItem key={`end-${slot.id}`} value={slot.end_time}>
                  {slot.end_time.substring(0, 5)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time validation message */}
      {startTime >= endTime && (
        <p className="text-sm text-red-600">
          ⚠️ End time should be later than start time
        </p>
      )}

      {/* Duration display */}
      {startTime < endTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            📅 Duration: {calculateDuration(startTime, endTime)} hours
          </p>
        </div>
      )}
    </div>
  );
};

const calculateDuration = (start: string, end: string): string => {
  // Handle both HH:MM and HH:MM:SS formats
  const [startHour, startMinute] = start.split(':').slice(0, 2).map(Number);
  const [endHour, endMinute] = end.split(':').slice(0, 2).map(Number);

  const startDate = new Date(0, 0, 0, startHour, startMinute);
  const endDate = new Date(0, 0, 0, endHour, endMinute);

  let diff = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));

  return `${hours}.${minutes === 30 ? '5' : '0'}`;
};

export default TimeSelector;
