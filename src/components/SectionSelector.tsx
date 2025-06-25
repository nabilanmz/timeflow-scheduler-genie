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
}

const SectionSelector = ({ selectedSections, onSectionsChange, selectedSubjects }: SectionSelectorProps) => {
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

    const addSection = (sectionId: string) => {
        if (!selectedSections.includes(sectionId)) {
            onSectionsChange([...selectedSections, sectionId]);
        }
    };

    const removeSection = (sectionId: string) => {
        onSectionsChange(selectedSections.filter(id => id !== sectionId));
    };

    // Filter sections based on selected subjects first, then by search term
    const availableSections = allSections.filter(section =>
        selectedSubjects.includes(section.subject_id.toString())
    );

    const filteredSections = availableSections.filter(section => {
        console.log("Filtering section:", section);
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

            {/* Search sections */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Search and select sections:</p>
                <Input
                    placeholder="Search sections by subject, lecturer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    disabled={selectedSubjects.length === 0}
                />
                {selectedSubjects.length === 0 && (
                    <p className="text-xs text-gray-500">Please select subjects first to see available sections.</p>
                )}
            </div>

            {/* Available sections */}
            {selectedSubjects.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                    {allSections.map((section) => (
                        <div
                            key={section.id}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedSections.includes(section.id.toString())
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-gray-50"
                                }`}
                            onClick={() => selectedSections.includes(section.id.toString()) ? removeSection(section.id.toString()) : addSection(section.id.toString())}
                        >
                            <div className="flex items-center gap-2">
                                <ListChecks className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{section.subject?.name} - Section {section.section_number} ({section.lecturer?.name})</span>
                            </div>
                            {selectedSections.includes(section.id.toString()) && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    ))}
                    {allSections.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No sections found for the selected subjects.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionSelector;
