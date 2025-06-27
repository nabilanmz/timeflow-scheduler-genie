import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, BookOpen } from "lucide-react";
import api from "@/lib/api";
import { Subject } from "@/types/api";

interface SubjectSelectorProps {
  selectedSubjects: number[];
  onSubjectsChange: (subjects: number[]) => void;
}

const SubjectSelector = ({ selectedSubjects, onSubjectsChange }: SubjectSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/subjects");
        const subjectsData = res.data.data || res.data;
        if (Array.isArray(subjectsData)) {
          setAllSubjects(subjectsData);
        } else {
          setAllSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setAllSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  const addSubject = (subjectId: number) => {
    if (!selectedSubjects.includes(subjectId)) {
      onSubjectsChange([...selectedSubjects, subjectId]);
    }
  };

  const removeSubject = (subjectId: number) => {
    onSubjectsChange(selectedSubjects.filter(id => id !== subjectId));
  };

  const filteredSubjects = allSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubjectById = (id: number) => allSubjects.find(s => s.id === id);

  return (
    <div className="space-y-4">
      {/* Selected subjects */}
      {selectedSubjects.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected subjects:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((subjectId) => {
              const subject = getSubjectById(subjectId);
              if (!subject) return null;
              return (
                <Badge
                  key={subject.id}
                  variant="default"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {subject.name}
                  <button
                    onClick={() => removeSubject(subject.id)}
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
            key={subject.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
              selectedSubjects.includes(subject.id)
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() =>
              selectedSubjects.includes(subject.id)
                ? removeSubject(subject.id)
                : addSubject(subject.id)
            }
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{subject.name}</span>
            </div>
            {selectedSubjects.includes(subject.id) && (
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
