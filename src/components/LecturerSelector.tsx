import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, User } from "lucide-react";
import api from "@/lib/api";
import { Lecturer } from "@/types/api";

interface LecturerSelectorProps {
  selectedLecturers: number[];
  onLecturersChange: (lecturers: number[]) => void;
}

const LecturerSelector = ({ selectedLecturers, onLecturersChange }: LecturerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allLecturers, setAllLecturers] = useState<Lecturer[]>([]);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await api.get("/api/lecturers");
        if (res.data && Array.isArray(res.data)) {
          setAllLecturers(res.data);
        } else {
          setAllLecturers([]);
        }
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      }
    };
    fetchLecturers();
  }, []);

  const addLecturer = (lecturerId: number) => {
    if (!selectedLecturers.includes(lecturerId)) {
      onLecturersChange([...selectedLecturers, lecturerId]);
    }
  };

  const removeLecturer = (lecturerId: number) => {
    onLecturersChange(selectedLecturers.filter(id => id !== lecturerId));
  };

  const filteredLecturers = allLecturers.filter(lecturer =>
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLecturerById = (id: number) => allLecturers.find(l => l.id === id);

  return (
    <div className="space-y-4">
      {/* Selected lecturers */}
      {selectedLecturers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected lecturers:</p>
          <div className="flex flex-wrap gap-2">
            {selectedLecturers.map((lecturerId) => {
              const lecturer = getLecturerById(lecturerId);
              if (!lecturer) return null;
              return (
                <Badge
                  key={lecturer.id}
                  variant="default"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1"
                >
                  <User className="h-3 w-3 mr-1" />
                  {lecturer.name}
                  <button
                    onClick={() => removeLecturer(lecturer.id)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
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
            key={lecturer.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedLecturers.includes(lecturer.id)
              ? "bg-orange-50 border border-orange-200"
              : "hover:bg-gray-50"
              }`}
            onClick={() => selectedLecturers.includes(lecturer.id) ? removeLecturer(lecturer.id) : addLecturer(lecturer.id)}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{lecturer.name}</span>
            </div>
            {selectedLecturers.includes(lecturer.id) && (
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
