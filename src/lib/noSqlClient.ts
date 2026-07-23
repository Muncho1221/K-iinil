import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SECOND_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SECOND_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NoSQL Supabase environment variables')
}

export const noSqlClient = createClient(supabaseUrl, supabaseAnonKey)
