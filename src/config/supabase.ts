import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewmescmxmuufvmswudqt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bWVzY214bXV1ZnZtc3d1ZHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NDAyMDEsImV4cCI6MjA0ODAxNjIwMX0.mHktWE9EDlMe9cwFgG9bpMEbdmLkWda9i2jBw1sDCBo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
