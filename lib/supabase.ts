// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

// ✅ للمتصفح: استخدم NEXT_PUBLIC_ variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sknybbyxencuhbenshk.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabaseInstance: any = null

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