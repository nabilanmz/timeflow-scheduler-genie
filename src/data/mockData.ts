
export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  description: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture_hall' | 'lab' | 'seminar_room' | 'auditorium';
  equipment: string[];
}

export interface Class {
  id: string;
  subjectId: string;
  lecturerId: string;
  venueId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  type: 'lecture' | 'tutorial' | 'lab' | 'seminar';
  maxStudents: number;
  enrolledStudents: number;
}

export interface TimetableEntry extends Class {
  subject: Subject;
  lecturer: Lecturer;
  venue: Venue;
}

// Mock data
export const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', credits: 3, description: 'Introduction to Calculus' },
  { id: '2', name: 'Physics', code: 'PHYS101', credits: 4, description: 'Classical Mechanics' },
  { id: '3', name: 'Chemistry', code: 'CHEM101', credits: 3, description: 'General Chemistry' },
  { id: '4', name: 'Computer Science', code: 'CS101', credits: 4, description: 'Programming Fundamentals' },
  { id: '5', name: 'English Literature', code: 'ENG101', credits: 3, description: 'Modern Literature' },
  { id: '6', name: 'History', code: 'HIST101', credits: 3, description: 'World History' },
];

export const mockLecturers: Lecturer[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.j@university.edu', department: 'Mathematics', subjects: ['1'] },
  { id: '2', name: 'Prof. Michael Chen', email: 'michael.c@university.edu', department: 'Physics', subjects: ['2'] },
  { id: '3', name: 'Dr. Emily Davis', email: 'emily.d@university.edu', department: 'Chemistry', subjects: ['3'] },
  { id: '4', name: 'Dr. Robert Wilson', email: 'robert.w@university.edu', department: 'Computer Science', subjects: ['4'] },
  { id: '5', name: 'Prof. Lisa Anderson', email: 'lisa.a@university.edu', department: 'English', subjects: ['5'] },
  { id: '6', name: 'Dr. James Taylor', email: 'james.t@university.edu', department: 'History', subjects: ['6'] },
];

export const mockVenues: Venue[] = [
  { id: '1', name: 'Main Lecture Hall A', capacity: 200, type: 'lecture_hall', equipment: ['projector', 'microphone', 'whiteboard'] },
  { id: '2', name: 'Science Lab 1', capacity: 30, type: 'lab', equipment: ['computers', 'lab_equipment', 'projector'] },
  { id: '3', name: 'Seminar Room B', capacity: 25, type: 'seminar_room', equipment: ['whiteboard', 'projector'] },
  { id: '4', name: 'Computer Lab 2', capacity: 40, type: 'lab', equipment: ['computers', 'projector', 'network'] },
  { id: '5', name: 'Auditorium', capacity: 500, type: 'auditorium', equipment: ['sound_system', 'projector', 'stage'] },
  { id: '6', name: 'Tutorial Room C', capacity: 15, type: 'seminar_room', equipment: ['whiteboard', 'tables'] },
];

export const mockClasses: Class[] = [
  { id: '1', subjectId: '1', lecturerId: '1', venueId: '1', dayOfWeek: 'monday', startTime: '09:00', endTime: '10:30', type: 'lecture', maxStudents: 100, enrolledStudents: 85 },
  { id: '2', subjectId: '2', lecturerId: '2', venueId: '1', dayOfWeek: 'tuesday', startTime: '10:00', endTime: '11:30', type: 'lecture', maxStudents: 100, enrolledStudents: 92 },
  { id: '3', subjectId: '3', lecturerId: '3', venueId: '2', dayOfWeek: 'wednesday', startTime: '14:00', endTime: '16:00', type: 'lab', maxStudents: 30, enrolledStudents: 28 },
  { id: '4', subjectId: '4', lecturerId: '4', venueId: '4', dayOfWeek: 'thursday', startTime: '11:00', endTime: '12:30', type: 'lecture', maxStudents: 40, enrolledStudents: 35 },
  { id: '5', subjectId: '5', lecturerId: '5', venueId: '3', dayOfWeek: 'friday', startTime: '13:00', endTime: '14:30', type: 'seminar', maxStudents: 25, enrolledStudents: 22 },
];

// Helper functions
export const getSubjectById = (id: string): Subject | undefined => 
  mockSubjects.find(subject => subject.id === id);

export const getLecturerById = (id: string): Lecturer | undefined => 
  mockLecturers.find(lecturer => lecturer.id === id);

export const getVenueById = (id: string): Venue | undefined => 
  mockVenues.find(venue => venue.id === id);

export const getTimetableEntries = (): TimetableEntry[] => {
  return mockClasses.map(classItem => ({
    ...classItem,
    subject: getSubjectById(classItem.subjectId)!,
    lecturer: getLecturerById(classItem.lecturerId)!,
    venue: getVenueById(classItem.venueId)!,
  }));
};
