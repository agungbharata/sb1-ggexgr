import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initDb() {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', 'init.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('Running init.sql...')
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('Error running SQL:', error)
      process.exit(1)
    }
    
    console.log('Database initialized successfully!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

initDb()
