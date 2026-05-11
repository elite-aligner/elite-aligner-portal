import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ✅ singleton — instance واحد فقط
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storageKey: 'elite-aligner-auth-token',
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return supabaseInstance
}