export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
      }
      invitations: {
        Row: {
          id: string
          user_id: string
          template_id: string
          event_name: string
          groom_name: string
          bride_name: string
          event_date: string
          venue: string
          custom_data: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          event_name: string
          groom_name: string
          bride_name: string
          event_date: string
          venue: string
          custom_data?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          event_name?: string
          groom_name?: string
          bride_name?: string
          event_date?: string
          venue?: string
          custom_data?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
