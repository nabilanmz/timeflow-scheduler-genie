
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, BookOpen } from "lucide-react";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
}

const commonSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "English Literature", "History", "Geography", "Economics", "Psychology",
  "Art", "Music", "Physical Education", "French", "Spanish", "German"
];

const SubjectSelector = ({ selectedSubjects, onSubjectsChange }: SubjectSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const addSubject = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      onSubjectsChange([...selectedSubjects, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    onSubjectsChange(selectedSubjects.filter(s => s !== subject));
  };

  const filteredSubjects = commonSubjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Selected subjects */}
      {selectedSubjects.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected subjects:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((subject) => (
              <Badge
                key={subject}
                variant="default"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {subject}
                <button
                  onClick={() => removeSubject(subject)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search subjects */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Search and select subjects:</p>
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Available subjects */}
      <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
        {filteredSubjects.map((subject) => (
          <div
            key={subject}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
              selectedSubjects.includes(subject)
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() => selectedSubjects.includes(subject) ? removeSubject(subject) : addSubject(subject)}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{subject}</span>
            </div>
            {selectedSubjects.includes(subject) && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
        {filteredSubjects.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No subjects found</p>
        )}
      </div>
    </div>
  );
};

export default SubjectSelector;
