import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, ListChecks } from "lucide-react";
import api from "@/lib/api";
import { Section } from "@/types/api";

interface SectionSelectorProps {
    selectedSections: string[];
    onSectionsChange: (sections: string[]) => void;
    selectedSubjects: string[]; // To filter sections by selected subjects
    availableSections?: Section[];
    disabled?: boolean;
}

const SectionSelector = ({ selectedSections, onSectionsChange, selectedSubjects, availableSections, disabled }: SectionSelectorProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allSections, setAllSections] = useState<Section[]>([]);

    useEffect(() => {
        const fetchSections = async () => {
            if (selectedSubjects.length === 0) {
                setAllSections([]);
                return;
            }
            try {
                // Fetch all sections and include subject and lecturer details
                const res = await api.get('/api/sections');
                console.log("Fetched sections:", res.data);
                // Laravel paginated resources are often in a `data` property
                const sectionsData = res.data;
                if (Array.isArray(sectionsData)) {
                    setAllSections(sectionsData);
                } else {
                    setAllSections([]);
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
                setAllSections([]);
            }
        };
        fetchSections();
    }, [selectedSubjects]);

    console.log("Selected subjects:", selectedSubjects);
    const addSection = (sectionId: string) => {
        if (!selectedSections.includes(sectionId)) {
            onSectionsChange([...selectedSections, sectionId]);
        }
    };

    const removeSection = (sectionId: string) => {
        onSectionsChange(selectedSections.filter(id => id !== sectionId));
    };

    // Filter sections based on selected subjects first, then by search term
    const filteredBySubject = allSections.filter(section =>
        selectedSubjects.includes(section.subject_id.toString())
    );

    const finalAvailableSections = availableSections || filteredBySubject;

    console.log("Available sections after filtering by subjects:", finalAvailableSections);
    const filteredSections = finalAvailableSections.filter(section => {
        const subjectName = section.subject?.name.toLowerCase() || '';
        const lecturerName = section.lecturer?.name.toLowerCase() || '';
        const sectionNumber = `section ${section.section_number}`.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();

        return subjectName.includes(searchTermLower) ||
            lecturerName.includes(searchTermLower) ||
            sectionNumber.includes(searchTermLower);
    });

    const getSectionById = (id: string) => allSections.find(s => s.id.toString() === id);

    return (
        <div className="space-y-4">
            {/* Selected sections */}
            {selectedSections.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected sections:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedSections.map((sectionId) => {
                            const section = getSectionById(sectionId);
                            if (!section) return null;
                            return (
                                <Badge
                                    key={section.id}
                                    variant="default"
                                    className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1"
                                >
                                    <ListChecks className="h-3 w-3 mr-1" />
                                    {section.subject?.name} - Section {section.section_number}
                                    <button
                                        onClick={() => removeSection(section.id.toString())}
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

            {/* Search and selection */}
            <div className="space-y-2">
                <Input
                    type="text"
                    placeholder="Search for sections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    disabled={disabled}
                />
                <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                    {filteredSections.length > 0 ? (
                        filteredSections.map((section) => (
                            <div
                                key={section.id}
                                onClick={() => addSection(section.id.toString())}
                                className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${selectedSections.includes(section.id.toString())
                                        ? "bg-blue-50 text-blue-800"
                                        : ""
                                    }`}
                            >
                                <p className="font-medium">{section.subject?.name} - Section {section.section_number}</p>
                                <p className="text-sm text-gray-500">Lecturer: {section.lecturer?.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No sections available for the selected subjects.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectionSelector;
