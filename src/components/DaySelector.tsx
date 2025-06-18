
import { Checkbox } from "@/components/ui/checkbox";

interface DaySelectorProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
}

const daysOfWeek = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

const DaySelector = ({ selectedDays, onDaysChange }: DaySelectorProps) => {
  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      onDaysChange(selectedDays.filter(d => d !== dayId));
    } else {
      onDaysChange([...selectedDays, dayId]);
    }
  };

  const selectWeekdays = () => {
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    onDaysChange(weekdays);
  };

  const selectAll = () => {
    onDaysChange(daysOfWeek.map(d => d.id));
  };

  const clearAll = () => {
    onDaysChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Quick selection buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={selectWeekdays}
          className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-full transition-colors"
        >
          Weekdays Only
        </button>
        <button
          onClick={selectAll}
          className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full transition-colors"
        >
          All Days
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Day checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <div
            key={day.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedDays.includes(day.id)
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300 hover:bg-green-25"
            }`}
            onClick={() => toggleDay(day.id)}
          >
            <div className="flex flex-col items-center space-y-2">
              <Checkbox
                checked={selectedDays.includes(day.id)}
                onChange={() => toggleDay(day.id)}
                className="pointer-events-none"
              />
              <div className="text-center">
                <div className="font-medium text-sm">{day.short}</div>
                <div className="text-xs text-gray-600 hidden md:block">{day.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDays.length > 0 && (
        <p className="text-sm text-gray-600">
          Selected {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default DaySelector;
