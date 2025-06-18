
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

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
  const [customSubject, setCustomSubject] = useState("");

  const addSubject = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      onSubjectsChange([...selectedSubjects, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    onSubjectsChange(selectedSubjects.filter(s => s !== subject));
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      addSubject(customSubject.trim());
      setCustomSubject("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomSubject();
    }
  };

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

      {/* Common subjects */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Choose from common subjects:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {commonSubjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedSubjects.includes(subject) ? "default" : "outline"}
              size="sm"
              onClick={() => selectedSubjects.includes(subject) ? removeSubject(subject) : addSubject(subject)}
              className="justify-start text-sm h-auto py-2"
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom subject input */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Add a custom subject:</p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter subject name..."
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={addCustomSubject}
            disabled={!customSubject.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
