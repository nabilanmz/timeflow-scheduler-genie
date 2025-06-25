import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { Day } from "@/types/api";

interface DaySelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
}

const DaySelector = ({ selectedDays, onDaysChange }: DaySelectorProps) => {
  const [weekdays, setWeekdays] = useState<Day[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const res = await api.get("/api/days");
        if (res.data && Array.isArray(res.data)) {
          setWeekdays(res.data);
        } else {
          setError("Failed to load days: Invalid data format.");
          setWeekdays([]);
        }
      } catch (error) {
        console.error("Error fetching days:", error);
        setError("Could not load days. The server might be down or unreachable.");
        setWeekdays([]);
      }
    };
    fetchDays();
  }, []);

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      onDaysChange(selectedDays.filter(d => d !== dayId));
    } else {
      onDaysChange([...selectedDays, dayId]);
    }
  };

  const selectAll = () => {
    onDaysChange(weekdays.map(d => d.id));
  };

  const clearAll = () => {
    onDaysChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Quick selection buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={selectAll}
          className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full transition-colors"
        >
          All Weekdays
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
        >
          Clear All
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Day checkboxes */}
      <div className="grid grid-cols-5 gap-4">
        {weekdays && weekdays.map((day) => (
          <div
            key={day.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedDays.includes(day.id)
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
                <div className="font-medium text-sm">{day.name.substring(0, 3)}</div>
                <div className="text-xs text-gray-600">{day.name}</div>
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
