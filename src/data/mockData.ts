// Subject -> Section -> Class hierarchy
export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
}

export interface Section {
  id: string;
  subjectId: string;
  sectionNumber: string;
  lecturerId: string;
  maxStudents: number;
  enrolledStudents: number;
}

export interface Class {
  id: string;
  sectionId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  venueId: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  type: 'classroom' | 'lab' | 'hall' | 'online';
  building: string;
  floor: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

// Mock data
export const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', description: 'Introduction to Calculus', credits: 3 },
  { id: '2', name: 'Physics', code: 'PHYS101', description: 'Classical Mechanics', credits: 4 },
  { id: '3', name: 'Chemistry', code: 'CHEM101', description: 'General Chemistry', credits: 3 },
  { id: '4', name: 'Computer Science', code: 'CS101', description: 'Programming Fundamentals', credits: 4 },
  { id: '5', name: 'Biology', code: 'BIO101', description: 'Cell Biology', credits: 3 },
  { id: '6', name: 'English Literature', code: 'ENG101', description: 'Modern Literature', credits: 3 },
];

export const mockLecturers: Lecturer[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', department: 'Mathematics', title: 'Associate Professor' },
  { id: '2', name: 'Prof. Michael Chen', email: 'michael.chen@university.edu', department: 'Physics', title: 'Professor' },
  { id: '3', name: 'Dr. Emily Davis', email: 'emily.davis@university.edu', department: 'Chemistry', title: 'Assistant Professor' },
  { id: '4', name: 'Dr. Robert Wilson', email: 'robert.wilson@university.edu', department: 'Computer Science', title: 'Associate Professor' },
  { id: '5', name: 'Dr. Lisa Brown', email: 'lisa.brown@university.edu', department: 'Biology', title: 'Professor' },
  { id: '6', name: 'Prof. James Miller', email: 'james.miller@university.edu', department: 'English', title: 'Professor' },
];

export const mockVenues: Venue[] = [
  { id: '1', name: 'Main Hall A', capacity: 200, type: 'hall', building: 'Academic Block A', floor: 1 },
  { id: '2', name: 'Lab 1', capacity: 30, type: 'lab', building: 'Science Block', floor: 2 },
  { id: '3', name: 'Room 101', capacity: 50, type: 'classroom', building: 'Academic Block B', floor: 1 },
  { id: '4', name: 'Computer Lab 2', capacity: 40, type: 'lab', building: 'IT Block', floor: 3 },
  { id: '5', name: 'Lecture Hall B', capacity: 150, type: 'hall', building: 'Academic Block A', floor: 2 },
  { id: '6', name: 'Online', capacity: 1000, type: 'online', building: 'Virtual', floor: 0 },
];

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@student.edu', role: 'student' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@student.edu', role: 'student' },
  { id: '3', name: 'Admin User', email: 'admin@university.edu', role: 'admin' },
  { id: '4', name: 'Alice Johnson', email: 'alice.johnson@student.edu', role: 'student' },
  { id: '5', name: 'Bob Wilson', email: 'bob.wilson@student.edu', role: 'student' },
];

export const mockSections: Section[] = [
  // Mathematics sections
  { id: '1', subjectId: '1', sectionNumber: 'A', lecturerId: '1', maxStudents: 50, enrolledStudents: 45 },
  { id: '2', subjectId: '1', sectionNumber: 'B', lecturerId: '1', maxStudents: 50, enrolledStudents: 38 },
  // Physics sections
  { id: '3', subjectId: '2', sectionNumber: 'A', lecturerId: '2', maxStudents: 40, enrolledStudents: 35 },
  // Chemistry sections
  { id: '4', subjectId: '3', sectionNumber: 'A', lecturerId: '3', maxStudents: 30, enrolledStudents: 28 },
  { id: '5', subjectId: '3', sectionNumber: 'B', lecturerId: '3', maxStudents: 30, enrolledStudents: 25 },
  // Computer Science sections
  { id: '6', subjectId: '4', sectionNumber: 'A', lecturerId: '4', maxStudents: 35, enrolledStudents: 35 },
  { id: '7', subjectId: '4', sectionNumber: 'B', lecturerId: '4', maxStudents: 35, enrolledStudents: 32 },
  // Biology sections
  { id: '8', subjectId: '5', sectionNumber: 'A', lecturerId: '5', maxStudents: 45, enrolledStudents: 40 },
];

export const mockClasses: Class[] = [
  // Mathematics Section A
  { id: '1', sectionId: '1', dayOfWeek: 'monday', startTime: '09:00', endTime: '10:30', venueId: '1', type: 'lecture' },
  { id: '2', sectionId: '1', dayOfWeek: 'wednesday', startTime: '09:00', endTime: '10:30', venueId: '1', type: 'lecture' },
  { id: '3', sectionId: '1', dayOfWeek: 'friday', startTime: '14:00', endTime: '15:30', venueId: '3', type: 'tutorial' },
  
  // Mathematics Section B
  { id: '4', sectionId: '2', dayOfWeek: 'tuesday', startTime: '11:00', endTime: '12:30', venueId: '1', type: 'lecture' },
  { id: '5', sectionId: '2', dayOfWeek: 'thursday', startTime: '11:00', endTime: '12:30', venueId: '1', type: 'lecture' },
  
  // Physics Section A
  { id: '6', sectionId: '3', dayOfWeek: 'tuesday', startTime: '10:00', endTime: '11:30', venueId: '5', type: 'lecture' },
  { id: '7', sectionId: '3', dayOfWeek: 'thursday', startTime: '10:00', endTime: '11:30', venueId: '5', type: 'lecture' },
  { id: '8', sectionId: '3', dayOfWeek: 'friday', startTime: '10:00', endTime: '12:00', venueId: '2', type: 'lab' },
  
  // Chemistry Section A
  { id: '9', sectionId: '4', dayOfWeek: 'wednesday', startTime: '14:00', endTime: '15:30', venueId: '3', type: 'lecture' },
  { id: '10', sectionId: '4', dayOfWeek: 'friday', startTime: '09:00', endTime: '11:00', venueId: '2', type: 'lab' },
  
  // Computer Science Section A
  { id: '11', sectionId: '6', dayOfWeek: 'monday', startTime: '13:00', endTime: '14:30', venueId: '4', type: 'lecture' },
  { id: '12', sectionId: '6', dayOfWeek: 'wednesday', startTime: '13:00', endTime: '15:00', venueId: '4', type: 'lab' },
];

// Helper functions
export const getSubjectById = (id: string): Subject | undefined => {
  return mockSubjects.find(subject => subject.id === id);
};

export const getLecturerById = (id: string): Lecturer | undefined => {
  return mockLecturers.find(lecturer => lecturer.id === id);
};

export const getVenueById = (id: string): Venue | undefined => {
  return mockVenues.find(venue => venue.id === id);
};

export const getSectionById = (id: string): Section | undefined => {
  return mockSections.find(section => section.id === id);
};

export const getSectionsBySubject = (subjectId: string): Section[] => {
  return mockSections.filter(section => section.subjectId === subjectId);
};

export const getClassesBySection = (sectionId: string): Class[] => {
  return mockClasses.filter(classItem => classItem.sectionId === sectionId);
};

// Enhanced data with relationships
export const getSectionsWithDetails = () => {
  return mockSections.map(section => ({
    ...section,
    subject: getSubjectById(section.subjectId),
    lecturer: getLecturerById(section.lecturerId),
    classes: getClassesBySection(section.id)
  }));
};

export const getClassesWithDetails = () => {
  return mockClasses.map(classItem => {
    const section = getSectionById(classItem.sectionId);
    return {
      ...classItem,
      section,
      subject: section ? getSubjectById(section.subjectId) : undefined,
      lecturer: section ? getLecturerById(section.lecturerId) : undefined,
      venue: getVenueById(classItem.venueId)
    };
  });
};

// Add the missing getTimetableEntries function
export const getTimetableEntries = () => {
  return mockClasses.map(classItem => {
    const section = getSectionById(classItem.sectionId);
    return {
      id: classItem.id,
      subject: section ? getSubjectById(section.subjectId) : undefined,
      lecturer: section ? getLecturerById(section.lecturerId) : undefined,
      venue: getVenueById(classItem.venueId),
      dayOfWeek: classItem.dayOfWeek,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      type: classItem.type,
      enrolledStudents: section?.enrolledStudents || 0,
      maxStudents: section?.maxStudents || 0
    };
  }).filter(entry => entry.subject && entry.lecturer && entry.venue);
};
