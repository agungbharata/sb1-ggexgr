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
      invitations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          slug: string
          bride_names: string
          groom_names: string
          date: string
          time: string
          venue: string
          opening_text?: string
          invitation_text?: string
          cover_photo?: string
          bride_photo?: string
          groom_photo?: string
          gallery?: string[]
          social_links?: Json[]
          bank_accounts?: Json[]
          message?: string
          custom_slug?: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          user_id: string
          slug: string
          bride_names: string
          groom_names: string
          date: string
          time: string
          venue: string
          opening_text?: string
          invitation_text?: string
          cover_photo?: string
          bride_photo?: string
          groom_photo?: string
          gallery?: string[]
          social_links?: Json[]
          bank_accounts?: Json[]
          message?: string
          custom_slug?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          slug?: string
          bride_names?: string
          groom_names?: string
          date?: string
          time?: string
          venue?: string
          opening_text?: string
          invitation_text?: string
          cover_photo?: string
          bride_photo?: string
          groom_photo?: string
          gallery?: string[]
          social_links?: Json[]
          bank_accounts?: Json[]
          message?: string
          custom_slug?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          role: 'admin' | 'client'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'client'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'client'
        }
      }
    }
  }
}
