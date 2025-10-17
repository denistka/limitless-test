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
      boards: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          board_id: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          position: number
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          board_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          position?: number
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          board_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          position?: number
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          board_id: string
          id: string
          last_seen: string | null
          user_id: string
        }
        Insert: {
          board_id: string
          id?: string
          last_seen?: string | null
          user_id: string
        }
        Update: {
          board_id?: string
          id?: string
          last_seen?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status: "todo" | "in_progress" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type Task = Database['public']['Tables']['tasks']['Row'] & {
  profiles?: {
    full_name: string | null
    email: string
  }
}

export type Board = Database['public']['Tables']['boards']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserPresence = Database['public']['Tables']['user_presence']['Row']

export type TaskStatus = Database['public']['Enums']['task_status']

// Form types
export type TaskCreate = {
  title: string
  description?: string
  status: TaskStatus
  board_id: string
  created_by: string
}

export type TaskUpdate = {
  title?: string
  description?: string
  status?: TaskStatus
  assigned_to?: string | null
  position?: number
}
