
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSelectorProps {
  startTime: string;
  endTime: string;
  onTimeChange: (startTime: string, endTime: string) => void;
}

const TimeSelector = ({ startTime, endTime, onTimeChange }: TimeSelectorProps) => {
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
              className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                startTime === preset.start && endTime === preset.end
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
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium">
            End Time
          </Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            className="w-full"
          />
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
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}`;
  }
  return `${hours}.${minutes < 10 ? '0' : ''}${Math.round(minutes * 100 / 60)}`;
};

export default TimeSelector;
