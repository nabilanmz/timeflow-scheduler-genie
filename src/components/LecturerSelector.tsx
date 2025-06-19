
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, User } from "lucide-react";

interface LecturerSelectorProps {
  selectedLecturers: string[];
  onLecturersChange: (lecturers: string[]) => void;
}

const sampleLecturers = [
  "Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Rodriguez", 
  "Prof. David Thompson", "Dr. Lisa Wang", "Prof. Robert Miller",
  "Dr. Amanda Garcia", "Prof. James Wilson", "Dr. Maria Lopez",
  "Prof. Kevin Brown", "Dr. Rachel Taylor", "Prof. Andrew Davis"
];

const LecturerSelector = ({ selectedLecturers, onLecturersChange }: LecturerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const addLecturer = (lecturer: string) => {
    if (!selectedLecturers.includes(lecturer)) {
      onLecturersChange([...selectedLecturers, lecturer]);
    }
  };

  const removeLecturer = (lecturer: string) => {
    onLecturersChange(selectedLecturers.filter(l => l !== lecturer));
  };

  const filteredLecturers = sampleLecturers.filter(lecturer =>
    lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Selected lecturers */}
      {selectedLecturers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected lecturers:</p>
          <div className="flex flex-wrap gap-2">
            {selectedLecturers.map((lecturer) => (
              <Badge
                key={lecturer}
                variant="default"
                className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1"
              >
                <User className="h-3 w-3 mr-1" />
                {lecturer}
                <button
                  onClick={() => removeLecturer(lecturer)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search lecturers */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Search and select lecturers:</p>
        <Input
          placeholder="Search lecturers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Available lecturers */}
      <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
        {filteredLecturers.map((lecturer) => (
          <div
            key={lecturer}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
              selectedLecturers.includes(lecturer)
                ? "bg-orange-50 border border-orange-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() => selectedLecturers.includes(lecturer) ? removeLecturer(lecturer) : addLecturer(lecturer)}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{lecturer}</span>
            </div>
            {selectedLecturers.includes(lecturer) && (
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
        ))}
        {filteredLecturers.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No lecturers found</p>
        )}
      </div>
    </div>
  );
};

export default LecturerSelector;
