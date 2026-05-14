import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabaseInstance: ReturnType<<typeof createClient> | null = null

export const createClientSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storageKey: 'elite-aligner-auth-token',
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  }
  return supabaseInstance
}

export const supabase = createClientSupabase()
