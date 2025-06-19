
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const addSubject = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      onSubjectsChange([...selectedSubjects, subject]);
    }
    setOpen(false);
  };

  const removeSubject = (subject: string) => {
    onSubjectsChange(selectedSubjects.filter(s => s !== subject));
  };

  const filteredSubjects = commonSubjects.filter(subject =>
    subject.toLowerCase().includes(search.toLowerCase()) &&
    !selectedSubjects.includes(subject)
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

      {/* Subject search and select */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Search and select subjects:</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              Search subjects...
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white">
            <Command>
              <CommandInput 
                placeholder="Search subjects..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No subjects found.</CommandEmpty>
                <CommandGroup>
                  {filteredSubjects.map((subject) => (
                    <CommandItem
                      key={subject}
                      onSelect={() => addSubject(subject)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSubjects.includes(subject) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {subject}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SubjectSelector;
