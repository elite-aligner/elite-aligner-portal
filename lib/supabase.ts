// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

// ✅ للـ localhost فقط - لا يستخدم Supabase على Vercel
const supabaseUrl = 'https://sknybbyxencuhbenshk.supabase.co'
const supabaseKey = 'sb_publishable_0drLNWdB48knxLuh7bzlvQ_nWRCa...'

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