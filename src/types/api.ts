export interface Day {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedTimetable {
  id: number;
  user_id: number;
  timetable: object;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lecturer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsList {
  max_subjects_per_day: string;
  max_concurrent_subjects: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number; // Added this
  created_at: string;
  updated_at: string;
  sections?: Section[]; // Added this
}

export interface Section {
  id: number;
  subject_id: number;
  section_number: number;
  lecturer_id: number;
  enrolled_students?: number;
  max_students?: number;
  created_at: string;
  updated_at: string;
  lecturer?: Lecturer;
  subject?: Subject;
  timetable_entries?: TimetableEntry[];
}

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface TimetableChangeRequest {
  id: number;
  user_id: number;
  generated_timetable_id: number;
  message: string;
  status: string;
  admin_response?: string;
  created_at: string;
  updated_at: string;
  user: User; // Added this
  generated_timetable: GeneratedTimetable;
}

export interface User { // Added this
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Timetable {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  timetable_entries: TimetableEntry[];
}

export interface TimetablePreferenceRequest {
  preferences: object;
}

export interface TimetableEntry {
  id: number;
  timetable_id: number;
  subject_id: number;
  lecturer_id: number;
  day_id: number;
  time_slot_id: number;
  activity: string;
  section: string;
  venue: string;
  tied_to?: number;
  created_at: string;
  updated_at: string;
  subject: Subject;
  lecturer: Lecturer;
  day: Day;
  time_slot: TimeSlot;
}

export interface TimetablePreference {
  id: number;
  user_id: number;
  preferences: object;
  created_at: string;
  updated_at: string;
}
