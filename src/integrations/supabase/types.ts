export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          end_time: string
          id: string
          section_id: string
          start_time: string
          tied_to: string | null
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          end_time: string
          id?: string
          section_id: string
          start_time: string
          tied_to?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          end_time?: string
          id?: string
          section_id?: string
          start_time?: string
          tied_to?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_tied_to_fkey"
            columns: ["tied_to"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_timetables: {
        Row: {
          generated_at: string | null
          id: string
          is_active: boolean | null
          timetable_data: Json
          user_id: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          timetable_data: Json
          user_id: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          timetable_data?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_timetables_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string | null
          enrolled_students: number
          id: string
          lecturer_id: string | null
          max_students: number
          section_number: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enrolled_students?: number
          id?: string
          lecturer_id?: string | null
          max_students?: number
          section_number: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enrolled_students?: number
          id?: string
          lecturer_id?: string | null
          max_students?: number
          section_number?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_lecturer_id_fkey"
            columns: ["lecturer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          enrolled_at: string | null
          id: string
          section_id: string
          student_id: string
        }
        Insert: {
          enrolled_at?: string | null
          id?: string
          section_id: string
          student_id: string
        }
        Update: {
          enrolled_at?: string | null
          id?: string
          section_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          credits: number
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credits?: number
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credits?: number
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      timetable_change_requests: {
        Row: {
          admin_response: string | null
          created_at: string | null
          generated_timetable_id: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          generated_timetable_id: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          generated_timetable_id?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_change_requests_generated_timetable_id_fkey"
            columns: ["generated_timetable_id"]
            isOneToOne: false
            referencedRelation: "generated_timetables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable_preferences: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          max_days_per_week: number
          preferred_days: Database["public"]["Enums"]["day_of_week"][]
          preferred_lecturers: string[]
          preferred_subjects: string[]
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string
          id?: string
          max_days_per_week?: number
          preferred_days?: Database["public"]["Enums"]["day_of_week"][]
          preferred_lecturers?: string[]
          preferred_subjects?: string[]
          start_time?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          max_days_per_week?: number
          preferred_days?: Database["public"]["Enums"]["day_of_week"][]
          preferred_lecturers?: string[]
          preferred_subjects?: string[]
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          building: string | null
          capacity: number
          created_at: string | null
          floor: number | null
          id: string
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          building?: string | null
          capacity?: number
          created_at?: string | null
          floor?: number | null
          id?: string
          name: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number
          created_at?: string | null
          floor?: number | null
          id?: string
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: "lecture" | "tutorial" | "lab" | "seminar"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      request_status: "pending" | "approved" | "rejected"
      user_role: "student" | "lecturer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: ["lecture", "tutorial", "lab", "seminar"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      request_status: ["pending", "approved", "rejected"],
      user_role: ["student", "lecturer", "admin"],
    },
  },
} as const
