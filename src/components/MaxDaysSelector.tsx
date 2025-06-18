
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MaxDaysSelectorProps {
  maxDays: number;
  onMaxDaysChange: (maxDays: number) => void;
}

const MaxDaysSelector = ({ maxDays, onMaxDaysChange }: MaxDaysSelectorProps) => {
  const handleSliderChange = (value: number[]) => {
    onMaxDaysChange(value[0]);
  };

  const quickOptions = [
    { days: 3, label: "Part-time (3 days)" },
    { days: 4, label: "Flexible (4 days)" },
    { days: 5, label: "Standard (5 days)" },
    { days: 6, label: "Intensive (6 days)" },
    { days: 7, label: "Full week (7 days)" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-lg font-semibold">Maximum Days Per Week</Label>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {maxDays} day{maxDays !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Quick selection buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {quickOptions.map((option) => (
          <button
            key={option.days}
            onClick={() => onMaxDaysChange(option.days)}
            className={`p-3 text-center border rounded-lg transition-all duration-200 ${
              maxDays === option.days
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
            }`}
          >
            <div className="font-bold text-lg">{option.days}</div>
            <div className="text-xs text-gray-600">{option.label.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="space-y-3">
        <Label className="text-sm text-gray-600">Or use the slider for precise control:</Label>
        <div className="px-3">
          <Slider
            value={[maxDays]}
            onValueChange={handleSliderChange}
            max={7}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 day</span>
            <span>7 days</span>
          </div>
        </div>
      </div>

      {/* Information box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 mt-0.5">💡</div>
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> Lower values give you more free days but may result in longer daily schedules. 
            Higher values spread your classes more evenly throughout the week.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaxDaysSelector;
