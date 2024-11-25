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
